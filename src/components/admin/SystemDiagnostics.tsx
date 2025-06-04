
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Database, 
  Users, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface DiagnosticResults {
  database: {
    connected: boolean;
    tables_accessible: string[];
    tables_failed: string[];
  };
  users: {
    total_profiles: number;
    roles_distribution: Record<string, number>;
    suspended_users: number;
    unverified_users: number;
  };
  auth: {
    session_status: string;
    current_user?: any;
    policies_working: boolean;
  };
  storage: {
    buckets_accessible: string[];
    buckets_failed: string[];
  };
  system: {
    feature_flags: any[];
    analytics_events_today: number;
    last_system_log: string;
  };
}

const SystemDiagnostics = () => {
  const [results, setResults] = useState<DiagnosticResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criticalTables = [
    'profiles', 'users', 'orders', 'offers', 'rides', 
    'transactions', 'messages', 'notifications'
  ];

  const runFullDiagnostics = async () => {
    setLoading(true);
    setError(null);

    try {
      const diagnostics: DiagnosticResults = {
        database: {
          connected: false,
          tables_accessible: [],
          tables_failed: []
        },
        users: {
          total_profiles: 0,
          roles_distribution: {},
          suspended_users: 0,
          unverified_users: 0
        },
        auth: {
          session_status: 'unknown',
          policies_working: false
        },
        storage: {
          buckets_accessible: [],
          buckets_failed: []
        },
        system: {
          feature_flags: [],
          analytics_events_today: 0,
          last_system_log: 'never'
        }
      };

      // Database connectivity tests
      for (const table of criticalTables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(1);
          if (error) {
            diagnostics.database.tables_failed.push(table);
          } else {
            diagnostics.database.tables_accessible.push(table);
          }
        } catch (err) {
          diagnostics.database.tables_failed.push(table);
        }
      }
      
      diagnostics.database.connected = diagnostics.database.tables_accessible.length > 0;

      // User statistics
      try {
        const { count: totalProfiles } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        diagnostics.users.total_profiles = totalProfiles || 0;

        const { data: rolesData } = await supabase
          .from('profiles')
          .select('role');
        
        if (rolesData) {
          diagnostics.users.roles_distribution = rolesData.reduce((acc, user) => {
            acc[user.role || 'unknown'] = (acc[user.role || 'unknown'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
        }

        const { count: suspendedCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_suspended', true);
        diagnostics.users.suspended_users = suspendedCount || 0;

        const { count: unverifiedCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('verified', false);
        diagnostics.users.unverified_users = unverifiedCount || 0;

      } catch (err) {
        console.error('User stats error:', err);
      }

      // Auth status
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError) {
          diagnostics.auth.session_status = 'error';
        } else {
          diagnostics.auth.session_status = session ? 'authenticated' : 'anonymous';
          diagnostics.auth.current_user = session?.user;
        }

        // Test RLS policies
        try {
          const { error: rlsError } = await supabase.from('profiles').select('user_id').limit(1);
          diagnostics.auth.policies_working = !rlsError;
        } catch (err) {
          diagnostics.auth.policies_working = false;
        }
      } catch (err) {
        diagnostics.auth.session_status = 'error';
      }

      // Storage tests
      try {
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
        if (storageError) {
          diagnostics.storage.buckets_failed.push('storage_access_failed');
        } else {
          diagnostics.storage.buckets_accessible = buckets?.map(b => b.name) || [];
        }
      } catch (err) {
        diagnostics.storage.buckets_failed.push('storage_connection_failed');
      }

      // System metrics
      try {
        const { data: featureFlags } = await supabase
          .from('active_feature_flags')
          .select('*')
          .eq('enabled', true);
        diagnostics.system.feature_flags = featureFlags || [];

        const today = new Date().toISOString().split('T')[0];
        const { count: analyticsCount } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today);
        diagnostics.system.analytics_events_today = analyticsCount || 0;

        const { data: lastLog } = await supabase
          .from('system_logs')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        diagnostics.system.last_system_log = lastLog?.created_at || 'never';

      } catch (err) {
        console.error('System metrics error:', err);
      }

      setResults(diagnostics);

    } catch (err: any) {
      console.error('Diagnostics failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runFullDiagnostics();
  }, []);

  const getOverallHealth = () => {
    if (!results) return 'unknown';
    
    if (!results.database.connected) return 'critical';
    if (results.database.tables_failed.length > 0) return 'warning';
    if (!results.auth.policies_working) return 'warning';
    if (results.storage.buckets_failed.length > 0) return 'warning';
    
    return 'healthy';
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Gesund</Badge>;
      case 'warning': return <Badge className="bg-amber-100 text-amber-800">Warnung</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Kritisch</Badge>;
      default: return <Badge variant="secondary">Unbekannt</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getHealthIcon(getOverallHealth())}
                System-Diagnose
              </CardTitle>
              <CardDescription>
                Umfassende Überprüfung aller Systemkomponenten
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getHealthBadge(getOverallHealth())}
              <Button 
                onClick={runFullDiagnostics} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Neu prüfen
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Diagnose fehlgeschlagen: {error}
              </AlertDescription>
            </Alert>
          )}

          {results && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="database">Datenbank</TabsTrigger>
                <TabsTrigger value="users">Benutzer</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">
                      {results.database.tables_accessible.length}/{criticalTables.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Tabellen OK</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{results.users.total_profiles}</div>
                    <div className="text-sm text-muted-foreground">Benutzer</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{results.system.feature_flags.length}</div>
                    <div className="text-sm text-muted-foreground">Feature Flags</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                    <div className="text-2xl font-bold">{results.users.suspended_users}</div>
                    <div className="text-sm text-muted-foreground">Gesperrt</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="database" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Erreichbare Tabellen</h4>
                    <div className="space-y-1">
                      {results.database.tables_accessible.map(table => (
                        <div key={table} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {table}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {results.database.tables_failed.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">Fehlerhafte Tabellen</h4>
                      <div className="space-y-1">
                        {results.database.tables_failed.map(table => (
                          <div key={table} className="flex items-center gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-red-600" />
                            {table}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Rollenverteilung</h4>
                    <div className="space-y-2">
                      {Object.entries(results.users.roles_distribution).map(([role, count]) => (
                        <div key={role} className="flex justify-between text-sm">
                          <span className="capitalize">{role}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Benutzer-Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Gesamt:</span>
                        <Badge>{results.users.total_profiles}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Gesperrt:</span>
                        <Badge variant="destructive">{results.users.suspended_users}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Unverifiziert:</span>
                        <Badge variant="secondary">{results.users.unverified_users}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="auth" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Session-Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={results.auth.session_status === 'authenticated' ? 'default' : 'secondary'}>
                          {results.auth.session_status}
                        </Badge>
                      </div>
                      {results.auth.current_user && (
                        <div className="flex justify-between">
                          <span>E-Mail:</span>
                          <span className="text-xs">{results.auth.current_user.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">RLS Policies</h4>
                    <div className="flex items-center gap-2">
                      {results.auth.policies_working ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm">
                        {results.auth.policies_working ? 'Funktionsfähig' : 'Fehlerhaft'}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="system" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Feature Flags</h4>
                    <div className="space-y-1">
                      {results.system.feature_flags.map((flag, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {flag.flag_name}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Aktivität</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Analytics heute:</span>
                        <Badge>{results.system.analytics_events_today}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Letzter Log:</span>
                        <span className="text-xs">
                          {results.system.last_system_log !== 'never' 
                            ? new Date(results.system.last_system_log).toLocaleString()
                            : 'Nie'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDiagnostics;

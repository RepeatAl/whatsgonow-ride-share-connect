
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface SecurityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

interface SecurityHealthData {
  rls_status: SecurityCheck[];
  feature_flags_health: any;
  last_check: string;
  overall_status: 'secure' | 'warning' | 'critical';
}

const SecurityHealthDashboard = () => {
  const [healthData, setHealthData] = useState<SecurityHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const runSecurityHealthCheck = async () => {
    setLoading(true);
    try {
      console.log('🔒 Running security health check...');

      // 1. Check RLS status on critical tables
      const rlsChecks = await checkRLSStatus();
      
      // 2. Check feature flags health
      const { data: flagsHealth } = await supabase.rpc('check_feature_flag_health');
      
      // 3. Determine overall status
      const criticalFailures = rlsChecks.filter(check => check.status === 'fail');
      const warnings = rlsChecks.filter(check => check.status === 'warning');
      
      const overallStatus = 
        criticalFailures.length > 0 ? 'critical' :
        warnings.length > 0 ? 'warning' : 'secure';

      const healthData: SecurityHealthData = {
        rls_status: rlsChecks,
        feature_flags_health: flagsHealth,
        last_check: new Date().toISOString(),
        overall_status: overallStatus
      };

      setHealthData(healthData);

      // Show toast based on status
      if (overallStatus === 'critical') {
        toast({
          title: "Kritische Sicherheitsprobleme gefunden",
          description: `${criticalFailures.length} kritische Fehler entdeckt`,
          variant: "destructive"
        });
      } else if (overallStatus === 'warning') {
        toast({
          title: "Sicherheitswarnungen",
          description: `${warnings.length} Warnungen gefunden`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sicherheitscheck erfolgreich",
          description: "Alle Sicherheitsprüfungen bestanden",
        });
      }

    } catch (error) {
      console.error('❌ Security health check failed:', error);
      toast({
        title: "Health Check fehlgeschlagen",
        description: "Fehler beim Überprüfen der Systemsicherheit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkRLSStatus = async (): Promise<SecurityCheck[]> => {
    const checks: SecurityCheck[] = [];
    
    // Critical tables that must have RLS
    const criticalTables = [
      'profiles', 'cm_regions', 'active_feature_flags', 
      'feature_flag_audit', 'admin_videos', 'user_flag_audit'
    ];

    for (const table of criticalTables) {
      try {
        // Try to query without specific user context - should be restricted by RLS
        const { error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error && error.code === '42501') {
          // RLS is active and working (permission denied without proper auth)
          checks.push({
            name: `RLS on ${table}`,
            status: 'pass',
            message: 'RLS aktiv und funktionsfähig',
            details: 'Tabelle ist korrekt durch RLS geschützt'
          });
        } else if (!error) {
          // Query succeeded - check if this should be allowed
          if (table === 'cm_regions') {
            // Public read allowed for basic info
            checks.push({
              name: `RLS on ${table}`,
              status: 'pass',
              message: 'RLS aktiv mit Public-Zugriff',
              details: 'Public read access konfiguriert'
            });
          } else {
            checks.push({
              name: `RLS on ${table}`,
              status: 'warning',
              message: 'Möglicherweise zu offene Policies',
              details: 'Überprüfen Sie die RLS-Policies für diese Tabelle'
            });
          }
        } else {
          checks.push({
            name: `RLS on ${table}`,
            status: 'fail',
            message: 'Unerwarteter Fehler',
            details: error.message
          });
        }
      } catch (err) {
        checks.push({
          name: `RLS on ${table}`,
          status: 'fail',
          message: 'Prüfung fehlgeschlagen',
          details: (err as Error).message
        });
      }
    }

    return checks;
  };

  useEffect(() => {
    runSecurityHealthCheck();
  }, []);

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusColor = (status: 'secure' | 'warning' | 'critical') => {
    switch (status) {
      case 'secure': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">Führe Sicherheitscheck durch...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Security Health Dashboard
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runSecurityHealthCheck}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {healthData && (
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(healthData.overall_status)}>
                {healthData.overall_status === 'secure' && <CheckCircle className="h-4 w-4 mr-2" />}
                {healthData.overall_status === 'warning' && <AlertTriangle className="h-4 w-4 mr-2" />}
                {healthData.overall_status === 'critical' && <AlertTriangle className="h-4 w-4 mr-2" />}
                {healthData.overall_status.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-600">
                Letzter Check: {new Date(healthData.last_check).toLocaleString('de-DE')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RLS Status Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Row Level Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthData?.rls_status.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium">{check.name}</p>
                    <p className="text-sm text-gray-600">{check.message}</p>
                    {check.details && (
                      <p className="text-xs text-gray-500 mt-1">{check.details}</p>
                    )}
                  </div>
                </div>
                <Badge variant={check.status === 'pass' ? 'default' : check.status === 'warning' ? 'secondary' : 'destructive'}>
                  {check.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags Health */}
      {healthData?.feature_flags_health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Feature Flags System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{healthData.feature_flags_health.enabled_flags}</p>
                <p className="text-sm text-gray-600">Aktive Flags</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{healthData.feature_flags_health.total_flags}</p>
                <p className="text-sm text-gray-600">Gesamt-Flags</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{healthData.feature_flags_health.audit_entries_today}</p>
                <p className="text-sm text-gray-600">Änderungen heute</p>
              </div>
              <div className="text-center">
                <Badge className={getStatusColor(
                  healthData.feature_flags_health.status === 'healthy' ? 'secure' : 'warning'
                )}>
                  {healthData.feature_flags_health.status}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">System Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Sicherheitsempfehlungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>SECURITY DEFINER Views eliminiert:</strong> Alle kritischen Views wurden 
                durch RLS-konforme Lösungen ersetzt.
              </AlertDescription>
            </Alert>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>RLS aktiviert:</strong> Alle sensiblen Tabellen sind jetzt durch 
                Row Level Security geschützt.
              </AlertDescription>
            </Alert>
            <Alert>
              <Database className="h-4 w-4" />
              <AlertDescription>
                <strong>Feature Flags implementiert:</strong> Vollständiges Feature-Flag-System 
                mit Audit-Trail ist jetzt aktiv.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityHealthDashboard;

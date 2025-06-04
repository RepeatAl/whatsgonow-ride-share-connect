
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface SystemHealth {
  database_connected: boolean;
  auth_status: string;
  storage_accessible: boolean;
  last_check: string;
  error_details?: string[];
}

const SystemHealthMonitor = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSystemHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      const healthCheck: SystemHealth = {
        database_connected: false,
        auth_status: 'unknown',
        storage_accessible: false,
        last_check: new Date().toISOString(),
        error_details: []
      };

      // Test database connection
      try {
        const { error: dbError } = await supabase.from('profiles').select('count').limit(1);
        healthCheck.database_connected = !dbError;
        if (dbError) healthCheck.error_details?.push(`Database: ${dbError.message}`);
      } catch (err) {
        healthCheck.error_details?.push(`Database: ${(err as Error).message}`);
      }

      // Test auth status
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        healthCheck.auth_status = session ? 'authenticated' : 'anonymous';
        if (authError) healthCheck.error_details?.push(`Auth: ${authError.message}`);
      } catch (err) {
        healthCheck.auth_status = 'error';
        healthCheck.error_details?.push(`Auth: ${(err as Error).message}`);
      }

      // Test storage accessibility
      try {
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
        healthCheck.storage_accessible = !storageError;
        if (storageError) healthCheck.error_details?.push(`Storage: ${storageError.message}`);
      } catch (err) {
        healthCheck.error_details?.push(`Storage: ${(err as Error).message}`);
      }

      setHealth(healthCheck);
    } catch (err: any) {
      console.error('System health check failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const getOverallStatus = () => {
    if (!health) return 'unknown';
    
    if (!health.database_connected) return 'critical';
    if (health.auth_status === 'error') return 'warning';
    if (!health.storage_accessible) return 'warning';
    
    return 'healthy';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">System OK</Badge>;
      case 'warning': return <Badge className="bg-amber-100 text-amber-800">Warnung</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Kritisch</Badge>;
      default: return <Badge variant="secondary">Unbekannt</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health Monitor
            </CardTitle>
            <CardDescription>
              Überwachung der Systemkomponenten und Verbindungen
            </CardDescription>
          </div>
          <Button 
            onClick={checkSystemHealth} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Aktualisieren
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              System Health Check fehlgeschlagen: {error}
            </AlertDescription>
          </Alert>
        )}

        {health && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(getOverallStatus())}
                <span className="font-medium">Gesamtstatus:</span>
                {getStatusBadge(getOverallStatus())}
              </div>
              <span className="text-sm text-muted-foreground">
                Letzte Prüfung: {new Date(health.last_check).toLocaleTimeString()}
              </span>
            </div>

            {/* Component Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {health.database_connected ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="text-sm font-medium">Datenbank</div>
                <div className="text-xs text-muted-foreground">
                  {health.database_connected ? 'Verbunden' : 'Fehler'}
                </div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {health.auth_status === 'authenticated' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : health.auth_status === 'anonymous' ? (
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="text-sm font-medium">Authentifizierung</div>
                <div className="text-xs text-muted-foreground">
                  {health.auth_status === 'authenticated' ? 'Angemeldet' : 
                   health.auth_status === 'anonymous' ? 'Anonym' : 'Fehler'}
                </div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {health.storage_accessible ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="text-sm font-medium">Storage</div>
                <div className="text-xs text-muted-foreground">
                  {health.storage_accessible ? 'Erreichbar' : 'Fehler'}
                </div>
              </div>
            </div>

            {/* Error Details */}
            {health.error_details && health.error_details.length > 0 && (
              <div className="border rounded-lg p-3 bg-red-50">
                <h4 className="font-medium mb-2 text-red-800">Fehlerdetails:</h4>
                <div className="space-y-1">
                  {health.error_details.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;

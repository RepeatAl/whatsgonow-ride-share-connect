import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface DiagnosticResult {
  test: string;
  status: 'checking' | 'passed' | 'failed' | 'warning';
  message: string;
  details?: string;
}

const HereMapDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    const tests: DiagnosticResult[] = [
      { test: 'Supabase API Key Check', status: 'checking', message: 'Prüfe HERE Maps API-Schlüssel über Supabase...' },
      { test: 'CDN Connectivity', status: 'checking', message: 'Teste Verbindung zu HERE Maps CDN...' },
      { test: 'HTTPS Check', status: 'checking', message: 'Prüfe HTTPS-Verbindung...' },
      { test: 'Browser Support', status: 'checking', message: 'Prüfe Browser-Kompatibilität...' },
      { test: 'CORS/CSP Check', status: 'checking', message: 'Prüfe Sicherheitsrichtlinien...' }
    ];

    // Update diagnostics one by one
    for (let i = 0; i < tests.length; i++) {
      setDiagnostics(prev => [...prev.slice(0, i), tests[i], ...tests.slice(i + 1)]);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Perform actual tests
      const updatedTest = await performDiagnosticTest(tests[i]);
      setDiagnostics(prev => [
        ...prev.slice(0, i),
        updatedTest,
        ...prev.slice(i + 1)
      ]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setIsRunning(false);
  };

  const performDiagnosticTest = async (test: DiagnosticResult): Promise<DiagnosticResult> => {
    switch (test.test) {
      case 'Supabase API Key Check':
        try {
          console.log('[Diagnostics] Testing Supabase API key access...');
          const { data, error } = await supabase.functions.invoke('get-here-maps-key');
          
          if (error) {
            return {
              ...test,
              status: 'failed',
              message: 'Supabase Edge Function Fehler',
              details: `Error: ${error.message}`
            };
          }
          
          if (data?.apiKey) {
            return {
              ...test,
              status: 'passed',
              message: 'API-Schlüssel erfolgreich von Supabase geladen',
              details: `Key: ${data.apiKey.substring(0, 8)}...`
            };
          }
          
          return {
            ...test,
            status: 'failed',
            message: 'API-Schlüssel nicht in Supabase Secrets gefunden',
            details: 'HERE_MAPS_API_KEY muss in Supabase Secrets konfiguriert werden'
          };
        } catch (error) {
          // Fallback to environment variable check
          const envKey = import.meta.env.VITE_HERE_MAPS_API_KEY;
          if (envKey && envKey !== 'demo-key') {
            return {
              ...test,
              status: 'warning',
              message: 'Verwendet Environment Variable als Fallback',
              details: `Key: ${envKey.substring(0, 8)}... (nicht empfohlen für Production)`
            };
          }
          
          return {
            ...test,
            status: 'failed',
            message: 'HERE Maps API-Schlüssel nicht verfügbar',
            details: 'Weder Supabase Secret noch Environment Variable konfiguriert'
          };
        }

      case 'CDN Connectivity':
        try {
          const response = await fetch('https://js.api.here.com/v3/3.1/mapsjs-bundle.js', { 
            method: 'HEAD',
            mode: 'no-cors'
          });
          return {
            ...test,
            status: 'passed',
            message: 'HERE Maps CDN erreichbar'
          };
        } catch (error) {
          return {
            ...test,
            status: 'failed',
            message: 'CDN nicht erreichbar',
            details: 'Netzwerk oder Firewall blockiert js.api.here.com'
          };
        }

      case 'HTTPS Check':
        const isHttps = window.location.protocol === 'https:';
        const isLocalhost = window.location.hostname === 'localhost';
        
        if (isHttps || isLocalhost) {
          return {
            ...test,
            status: 'passed',
            message: isHttps ? 'HTTPS aktiv' : 'Localhost-Entwicklung erkannt'
          };
        }
        return {
          ...test,
          status: 'warning',
          message: 'HTTP-Verbindung kann HERE Maps blockieren',
          details: 'Für Production HTTPS erforderlich'
        };

      case 'Browser Support':
        const hasGeolocation = 'geolocation' in navigator;
        const hasWebGL = !!window.WebGLRenderingContext;
        
        if (hasGeolocation && hasWebGL) {
          return {
            ...test,
            status: 'passed',
            message: 'Browser unterstützt HERE Maps'
          };
        }
        return {
          ...test,
          status: 'warning',
          message: 'Eingeschränkte Browser-Unterstützung',
          details: `Geolocation: ${hasGeolocation ? '✓' : '✗'}, WebGL: ${hasWebGL ? '✓' : '✗'}`
        };

      case 'CORS/CSP Check':
        // Check if HERE Maps script can be loaded
        if (window.H) {
          return {
            ...test,
            status: 'passed',
            message: 'HERE Maps SDK erfolgreich geladen'
          };
        }
        return {
          ...test,
          status: 'failed',
          message: 'HERE Maps SDK nicht geladen',
          details: 'CORS oder CSP verhindert SDK-Laden'
        };

      default:
        return {
          ...test,
          status: 'failed',
          message: 'Unbekannter Test'
        };
    }
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const variants = {
      checking: 'secondary',
      passed: 'default',
      failed: 'destructive',
      warning: 'secondary'
    } as const;

    const labels = {
      checking: 'Prüfe...',
      passed: 'OK',
      failed: 'Fehler',
      warning: 'Warnung'
    };

    return (
      <Badge variant={variants[status]} className="ml-auto">
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>HERE Maps Diagnose</span>
        </CardTitle>
        <CardDescription>
          Automatische Überprüfung der HERE Maps Integration über Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Diagnose läuft...
            </>
          ) : (
            'Diagnose starten'
          )}
        </Button>

        {diagnostics.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Testergebnisse:</h4>
            {diagnostics.map((diagnostic, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{diagnostic.test}</h5>
                    {getStatusBadge(diagnostic.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{diagnostic.message}</p>
                  {diagnostic.details && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">{diagnostic.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {diagnostics.length > 0 && !isRunning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>
                Falls Fehler auftreten, prüfen Sie die 
                <a 
                  href="https://docs.lovable.dev/tips-tricks/troubleshooting" 
                  className="ml-1 underline inline-flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Troubleshooting-Dokumentation
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </p>
              <p className="text-xs">
                Bei API-Key-Problemen: Supabase Secrets überprüfen und HERE_MAPS_API_KEY setzen.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HereMapDiagnostics;

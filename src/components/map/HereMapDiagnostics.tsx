
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const HereMapDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState({
    hereSDKLoaded: false,
    networkConnectivity: 'unknown',
    domainWhitelisted: 'unknown',
    cspHeaders: 'unknown'
  });

  const [isChecking, setIsChecking] = useState(false);

  const runDiagnostics = async () => {
    setIsChecking(true);
    const results = { ...diagnostics };

    // Check if HERE SDK is loaded
    results.hereSDKLoaded = !!window.H;
    console.log('[Diagnostics] HERE SDK loaded:', results.hereSDKLoaded);

    // Test network connectivity to HERE API
    try {
      const response = await fetch('https://js.api.here.com/v3/3.1/mapsjs-bundle.js', { 
        method: 'HEAD',
        mode: 'no-cors' 
      });
      results.networkConnectivity = 'ok';
      console.log('[Diagnostics] Network connectivity: OK');
    } catch (error) {
      results.networkConnectivity = 'failed';
      console.log('[Diagnostics] Network connectivity: FAILED', error);
    }

    // Check if we can load a script tag (CSP test)
    try {
      const testScript = document.createElement('script');
      testScript.src = 'https://js.api.here.com/v3/3.1/mapsjs-bundle.js';
      testScript.async = true;
      
      const scriptLoadPromise = new Promise((resolve, reject) => {
        testScript.onload = () => resolve('ok');
        testScript.onerror = () => reject('failed');
        setTimeout(() => reject('timeout'), 5000);
      });

      document.head.appendChild(testScript);
      
      try {
        await scriptLoadPromise;
        results.cspHeaders = 'ok';
        console.log('[Diagnostics] CSP headers: OK');
      } catch {
        results.cspHeaders = 'blocked';
        console.log('[Diagnostics] CSP headers: BLOCKED');
      }
      
      document.head.removeChild(testScript);
    } catch (error) {
      results.cspHeaders = 'error';
      console.log('[Diagnostics] CSP test error:', error);
    }

    setDiagnostics(results);
    setIsChecking(false);
  };

  const getStatusIcon = (status: string | boolean) => {
    if (status === true || status === 'ok') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === false || status === 'failed' || status === 'blocked' || status === 'error') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else if (status === 'unknown') {
      return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string | boolean) => {
    if (status === true || status === 'ok') return 'OK';
    if (status === false || status === 'failed') return 'Fehler';
    if (status === 'blocked') return 'Blockiert';
    if (status === 'error') return 'Fehler';
    if (status === 'unknown') return 'Unbekannt';
    return 'Unbekannt';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          HERE Maps Diagnose
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">HERE SDK geladen</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(diagnostics.hereSDKLoaded)}
              <span className="text-sm">{getStatusText(diagnostics.hereSDKLoaded)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Netzwerk-Konnektivität</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(diagnostics.networkConnectivity)}
              <span className="text-sm">{getStatusText(diagnostics.networkConnectivity)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">CSP Headers</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(diagnostics.cspHeaders)}
              <span className="text-sm">{getStatusText(diagnostics.cspHeaders)}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={runDiagnostics} 
          disabled={isChecking}
          className="w-full"
          size="sm"
        >
          {isChecking ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Diagnose läuft...
            </>
          ) : (
            'Diagnose starten'
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Erwartete Domain:</strong></p>
          <p className="font-mono bg-gray-50 p-1 rounded text-xs break-all">
            preview--whatsgonow-ride-share-connect.lovable.app
          </p>
          <p className="text-xs text-gray-400">
            Diese Domain muss im HERE Developer Portal eingetragen sein.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HereMapDiagnostics;

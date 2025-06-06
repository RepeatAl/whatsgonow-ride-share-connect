
import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface SecureHereMapLoaderProps {
  onApiKeyLoaded: (apiKey: string) => void;
  onError: (error: string) => void;
}

/**
 * Sicherer HERE Maps API Key Loader
 * Lädt API Key aus Supabase Secrets über Edge Function
 */
const SecureHereMapLoader: React.FC<SecureHereMapLoaderProps> = ({ 
  onApiKeyLoaded, 
  onError 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const loadingRef = useRef(false);

  const loadApiKey = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      console.log('🔐 Loading HERE Maps API Key from Supabase Secrets...');
      setLoading(true);
      setError(null);
      setKeyStatus('loading');

      // Lade API Key über Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('get-here-maps-key');

      if (error) {
        throw new Error(`Edge Function Error: ${error.message}`);
      }

      if (!data || !data.success || !data.apiKey) {
        throw new Error('API Key nicht verfügbar oder ungültig');
      }

      console.log('✅ HERE Maps API Key successfully loaded');
      setKeyStatus('loaded');
      onApiKeyLoaded(data.apiKey);

    } catch (err) {
      console.error('❌ Failed to load HERE Maps API Key:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setKeyStatus('error');
      onError(errorMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    loadApiKey();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <div className="flex items-center space-x-2 text-blue-700">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Lade sichere HERE Maps Credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || keyStatus === 'error') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          <div className="space-y-2">
            <div className="font-medium">HERE Maps API Key Fehler:</div>
            <div className="text-sm">{error}</div>
            <div className="text-xs text-gray-600 mt-2">
              Mögliche Lösungen:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>API Key in Supabase Secrets konfigurieren</li>
                <li>HERE Developer Portal: Services aktivieren</li>
                <li>Domain-Whitelist überprüfen</li>
              </ul>
            </div>
            <Button onClick={() => loadApiKey()} variant="outline" size="sm" className="mt-3">
              <RefreshCw className="h-4 w-4 mr-2" />
              Erneut versuchen
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (keyStatus === 'loaded') {
    return (
      <div className="flex items-center space-x-2 text-green-600 text-sm mb-2">
        <Shield className="h-4 w-4" />
        <span>HERE Maps Credentials erfolgreich geladen</span>
      </div>
    );
  }

  return null;
};

export default SecureHereMapLoader;

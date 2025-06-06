
import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useTranslation } from 'react-i18next';

interface SecureHereMapLoaderProps {
  onApiKeyLoaded: (apiKey: string) => void;
  onError: (error: string) => void;
}

/**
 * Sichere HERE Maps API Key Verwaltung über Supabase Edge Function
 * Verwendet get-here-maps-key für zentrale, sichere Key-Verwaltung
 */
const SecureHereMapLoader: React.FC<SecureHereMapLoaderProps> = ({ 
  onApiKeyLoaded, 
  onError 
}) => {
  const { t } = useTranslation(['common', 'map']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyStatus, setKeyStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const loadingRef = useRef(false);

  const loadApiKey = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      console.log('🔐 Loading HERE Maps API Key via Supabase Edge Function...');
      setLoading(true);
      setError(null);
      setKeyStatus('loading');

      // Sichere API Key Abfrage über Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('get-here-maps-key');

      if (functionError) {
        console.error('❌ Edge Function error:', functionError);
        throw new Error(t('map:api_key_fetch_failed', 'API-Schlüssel konnte nicht geladen werden'));
      }

      if (!data || !data.success || !data.apiKey) {
        console.error('❌ Invalid response from get-here-maps-key:', data);
        throw new Error(t('map:api_key_invalid_response', 'Ungültige Antwort beim Laden des API-Schlüssels'));
      }

      console.log('✅ HERE Maps API Key successfully loaded via Edge Function');
      setKeyStatus('loaded');
      onApiKeyLoaded(data.apiKey);

    } catch (err) {
      console.error('❌ Failed to load HERE Maps API Key:', err);
      const errorMessage = err instanceof Error ? err.message : t('map:unknown_error', 'Unbekannter Fehler');
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
            <span className="text-sm font-medium">
              {t('map:loading_credentials', 'Lade Kartendienst-Anmeldedaten...')}
            </span>
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
            <div className="font-medium">
              {t('map:service_unavailable', 'Kartendienst aktuell nicht verfügbar')}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('map:service_unavailable_description', 'Die Karte kann momentan nicht geladen werden. Bitte versuchen Sie es später erneut.')}
            </div>
            <Button onClick={() => loadApiKey()} variant="outline" size="sm" className="mt-3">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common:retry', 'Erneut versuchen')}
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
        <span>{t('map:credentials_loaded', 'Kartendienst erfolgreich verbunden')}</span>
      </div>
    );
  }

  return null;
};

export default SecureHereMapLoader;

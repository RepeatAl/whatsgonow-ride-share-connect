import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import HereMapModularLoader from './HereMapModularLoader';
import SecureHereMapLoader from './SecureHereMapLoader';
import MapFallback from './MapFallback';
import { PublicMapMarkers } from './PublicMapMarkers';

// CRITICAL FIX: Conditional Hook Import - nur nach Consent laden
import { usePublicMapData } from '@/hooks/usePublicMapData';

interface StableHereMapWithDataProps {
  width?: string;
  height?: string;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

/**
 * CRITICAL GDPR-COMPLIANT: HERE Maps nur nach explizitem Consent
 * Diese Komponente wird nur gerendert wenn mapConsent === true
 */
const StableHereMapWithData: React.FC<StableHereMapWithDataProps> = ({
  width = '100%',
  height = '400px',
  className = '',
  center = { lat: 51.1657, lng: 10.4515 },
  zoom = 6
}) => {
  const { t } = useTranslation(['common', 'landing', 'map']);
  const { currentLanguage } = useLanguageMCP();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const platformRef = useRef<any>(null);
  const uiRef = useRef<any>(null);
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'api_key' | 'network' | 'cors' | 'unknown'>('unknown');
  const [sdkReady, setSdkReady] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // CRITICAL FIX: Map Data Hook nur ausführen wenn Komponente gerendert wird
  // (Komponente wird nur gerendert wenn Consent === true)
  console.log('🛡️ StableHereMapWithData: Loading with EXPLICIT consent');
  const { mapData, loading: dataLoading, error: dataError, refetch } = usePublicMapData();

  const initializeMap = async () => {
    try {
      console.log('[StableHereMap] 🚀 Initializing map with secure credentials...');

      if (!window.H || !apiKey) {
        throw new Error(t('map:sdk_not_ready', 'Kartendienst nicht bereit'));
      }

      const lang = currentLanguage === 'de' ? 'de-DE' : 
                   currentLanguage === 'ar' ? 'ar-SA' : 
                   'en-US';
      
      platformRef.current = new window.H.service.Platform({
        'apikey': apiKey,
        'useHTTPS': true,
        'lang': lang
      });

      const defaultLayers = platformRef.current.createDefaultLayers();

      if (mapRef.current) {
        mapInstanceRef.current = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            zoom: zoom,
            center: center
          }
        );

        const mapEvents = new window.H.mapevents.MapEvents(mapInstanceRef.current);
        const behavior = new window.H.mapevents.Behavior(mapEvents);

        uiRef.current = window.H.ui.UI.createDefault(mapInstanceRef.current, defaultLayers, lang);

        try {
          if (defaultLayers.vector?.normal?.trafficincidents) {
            mapInstanceRef.current.addLayer(defaultLayers.vector.normal.trafficincidents);
          }
        } catch (trafficError) {
          console.warn('[StableHereMap] ⚠️ Traffic layer not available:', trafficError);
        }

        setMapReady(true);
        console.log('[StableHereMap] ✅ Map initialization complete');
      }

    } catch (err) {
      console.error('[StableHereMap] ❌ Map initialization error:', err);
      setError(t('map:initialization_failed', 'Karte konnte nicht geladen werden'));
      setErrorType('unknown');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyLoaded = (loadedApiKey: string) => {
    console.log('[StableHereMap] ✅ API Key loaded securely');
    setApiKey(loadedApiKey);
    setError(null);
    setErrorType('unknown');
  };

  const handleApiKeyError = (errorMessage: string) => {
    console.error('[StableHereMap] ❌ API Key loading error:', errorMessage);
    setError(t('map:service_unavailable', 'Kartendienst aktuell nicht verfügbar'));
    setErrorType('api_key');
    setIsLoading(false);
  };

  const handleSdkLoad = () => {
    console.log('[StableHereMap] ✅ SDK loaded successfully');
    setSdkReady(true);
  };

  const handleSdkError = (errorMessage: string) => {
    console.error('[StableHereMap] ❌ SDK loading error:', errorMessage);
    setError(t('map:service_unavailable', 'Kartendienst aktuell nicht verfügbar'));
    
    if (errorMessage.includes('CSP') || errorMessage.includes('Content Security Policy')) {
      setErrorType('cors');
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      setErrorType('network');
    } else {
      setErrorType('unknown');
    }
    
    setIsLoading(false);
  };

  const handleMarkerClick = (item: any) => {
    console.log('[StableHereMap] 📍 Marker clicked:', item.id);
  };

  useEffect(() => {
    if (sdkReady && apiKey) {
      initializeMap();
    }
  }, [sdkReady, apiKey, currentLanguage]);

  const handleRetry = () => {
    console.log('[StableHereMap] 🔄 Retrying initialization...');
    setError(null);
    setIsLoading(true);
    setMapReady(false);
    setSdkReady(false);
    setApiKey(null);
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (error) {
    return (
      <MapFallback 
        height={height}
        errorType={errorType}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className={`w-full relative ${className}`} style={{ width, height }}>
      <SecureHereMapLoader 
        onApiKeyLoaded={handleApiKeyLoaded}
        onError={handleApiKeyError}
      />
      
      {apiKey && (
        <HereMapModularLoader onLoad={handleSdkLoad} onError={handleSdkError} />
      )}
      
      {(isLoading || dataLoading || !apiKey) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg z-10 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4 bg-background/90 p-6 rounded-lg shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <div className="text-foreground font-medium mb-1">
                {!apiKey ? t('map:loading_credentials', 'Lade Anmeldedaten...') : 
                 isLoading ? t('map:initializing', 'Initialisiere Karte...') : 
                 t('map:loading_data', 'Lade Transportdaten...')}
              </div>
              {mapData.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {mapData.length} {t('map:items_found', 'Einträge gefunden')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {dataError && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{t('map:data_load_error', 'Daten konnten nicht geladen werden')}</span>
              <Button onClick={refetch} variant="outline" size="sm" className="ml-2">
                <RefreshCw className="h-4 w-4 mr-1" />
                {t('common:retry', 'Wiederholen')}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden bg-muted/10"
        style={{ 
          minHeight: '300px',
          opacity: isLoading || !apiKey ? 0.3 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />

      {mapReady && mapInstanceRef.current && uiRef.current && apiKey && (
        <PublicMapMarkers
          mapInstance={mapInstanceRef.current}
          uiInstance={uiRef.current}
          mapData={mapData}
          onMarkerClick={handleMarkerClick}
        />
      )}
      
      {mapReady && !isLoading && !dataLoading && apiKey && (
        <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm border">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{mapData.length}</span>
            <span className="text-muted-foreground">{t('map:active_items', 'aktive Einträge')}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {mapData.filter(item => item.type === 'trip').length} {t('map:trips', 'Fahrten')} • {' '}
            {mapData.filter(item => item.type === 'order').length} {t('map:orders', 'Aufträge')}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs border">
        <div className="font-medium text-foreground mb-2">{t('map:price_legend', 'Preislegende')}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">&lt; 15€</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-muted-foreground">15-25€</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">&gt; 25€</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StableHereMapWithData;

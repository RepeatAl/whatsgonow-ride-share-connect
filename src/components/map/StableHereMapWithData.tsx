
import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import HereMapModularLoader from './HereMapModularLoader';
import SecureHereMapLoader from './SecureHereMapLoader';
import { PublicMapMarkers } from './PublicMapMarkers';
import { usePublicMapData } from '@/hooks/usePublicMapData';

interface StableHereMapWithDataProps {
  width?: string;
  height?: string;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

/**
 * Stabilisierte HERE Maps Komponente mit sicherem API Key Loading
 * Behebt 401-Fehler und Tile-Loading-Probleme
 */
const StableHereMapWithData: React.FC<StableHereMapWithDataProps> = ({
  width = '100%',
  height = '400px',
  className = '',
  center = { lat: 51.1657, lng: 10.4515 }, // Deutschland Zentrum
  zoom = 6
}) => {
  const { t } = useTranslation(['common', 'landing']);
  const { currentLanguage } = useLanguageMCP();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const platformRef = useRef<any>(null);
  const uiRef = useRef<any>(null);
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Lade öffentliche Map-Daten mit Fehlerbehandlung
  const { mapData, loading: dataLoading, error: dataError, refetch } = usePublicMapData();

  const initializeMap = async () => {
    try {
      console.log('[Stable HERE Maps] 🚀 Initializing with secure API key...');

      if (!window.H || !apiKey) {
        throw new Error('HERE Maps SDK oder API Key nicht verfügbar');
      }

      // Initialize Platform mit Sprachunterstützung
      const lang = currentLanguage === 'de' ? 'de-DE' : currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
      
      platformRef.current = new window.H.service.Platform({
        'apikey': apiKey,
        'useHTTPS': true,
        'lang': lang
      });

      const defaultLayers = platformRef.current.createDefaultLayers();

      // Create Map Instance
      if (mapRef.current) {
        mapInstanceRef.current = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            zoom: zoom,
            center: center
          }
        );

        // Enable map interaction
        const mapEvents = new window.H.mapevents.MapEvents(mapInstanceRef.current);
        const behavior = new window.H.mapevents.Behavior(mapEvents);

        // Enable UI controls
        uiRef.current = window.H.ui.UI.createDefault(mapInstanceRef.current, defaultLayers);

        // Add traffic layer mit Fehlerbehandlung
        try {
          if (defaultLayers.vector.normal.trafficincidents) {
            mapInstanceRef.current.addLayer(defaultLayers.vector.normal.trafficincidents);
          }
        } catch (trafficError) {
          console.warn('[Stable HERE Maps] ⚠️ Traffic layer failed, continuing without it:', trafficError);
        }

        setMapReady(true);
        console.log('[Stable HERE Maps] ✅ Map initialization complete');
      }

    } catch (err) {
      console.error('[Stable HERE Maps] ❌ Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Map initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyLoaded = (loadedApiKey: string) => {
    console.log('[Stable HERE Maps] ✅ API Key loaded, ready to initialize');
    setApiKey(loadedApiKey);
    setError(null);
  };

  const handleApiKeyError = (errorMessage: string) => {
    console.error('[Stable HERE Maps] ❌ API Key loading error:', errorMessage);
    setError(`API Key Error: ${errorMessage}`);
    setIsLoading(false);
  };

  const handleSdkLoad = () => {
    console.log('[Stable HERE Maps] ✅ SDK loaded successfully');
    setSdkReady(true);
  };

  const handleSdkError = (errorMessage: string) => {
    console.error('[Stable HERE Maps] ❌ SDK loading error:', errorMessage);
    setError(`SDK Loading Error: ${errorMessage}`);
    setIsLoading(false);
  };

  const handleMarkerClick = (item: any) => {
    console.log('[Stable HERE Maps] 📍 Marker clicked:', item);
  };

  // Initialize map when both SDK and API key are ready
  useEffect(() => {
    if (sdkReady && apiKey) {
      initializeMap();
    }
  }, [sdkReady, apiKey, currentLanguage]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setMapReady(false);
    setSdkReady(false);
    setApiKey(null);
    
    // Trigger reload
    window.location.reload();
  };

  if (error) {
    return (
      <Alert className="w-full">
        <AlertDescription>
          <div className="space-y-3">
            <div className="font-medium">HERE Maps konnte nicht geladen werden:</div>
            <div className="text-sm">{error}</div>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Neu laden
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full relative ${className}`} style={{ width, height }}>
      {/* Secure API Key Loader */}
      <SecureHereMapLoader 
        onApiKeyLoaded={handleApiKeyLoaded}
        onError={handleApiKeyError}
      />
      
      {/* Load HERE Maps SDK nur wenn API Key verfügbar */}
      {apiKey && (
        <HereMapModularLoader onLoad={handleSdkLoad} onError={handleSdkError} />
      )}
      
      {/* Loading State */}
      {(isLoading || dataLoading || !apiKey) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-700 font-medium">
              {!apiKey ? 'Lade API Credentials...' : 
               isLoading ? t('landing:map_loading') : 
               t('landing:data_loading')}
            </span>
            {mapData.length > 0 && (
              <div className="text-sm text-gray-500">
                {mapData.length} {t('landing:items_found')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Error */}
      {dataError && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <Alert variant="destructive">
            <AlertDescription>
              {t('landing:data_load_error')}: {dataError}
              <Button onClick={refetch} variant="outline" size="sm" className="ml-2">
                <RefreshCw className="h-4 w-4 mr-1" />
                {t('common:retry')}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ 
          minHeight: '300px',
          opacity: isLoading || !apiKey ? 0.3 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />

      {/* Public Map Markers nur wenn alles bereit ist */}
      {mapReady && mapInstanceRef.current && uiRef.current && apiKey && (
        <PublicMapMarkers
          mapInstance={mapInstanceRef.current}
          uiInstance={uiRef.current}
          mapData={mapData}
          onMarkerClick={handleMarkerClick}
        />
      )}
      
      {/* Map Stats */}
      {mapReady && !isLoading && !dataLoading && apiKey && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{mapData.length}</span>
            <span className="text-gray-600">{t('landing:active_items')}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {mapData.filter(item => item.type === 'trip').length} {t('landing:trips')} • {' '}
            {mapData.filter(item => item.type === 'order').length} {t('landing:orders')}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs">
        <div className="font-medium text-gray-900 mb-2">{t('landing:price_legend')}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>&lt; 15€</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>15-25€</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>&gt; 25€</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StableHereMapWithData;

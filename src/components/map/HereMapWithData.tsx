import React, { useState, useRef, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import HereMapModularLoader from './HereMapModularLoader';
import { PublicMapMarkers } from './PublicMapMarkers';
import { usePublicMapData } from '@/hooks/usePublicMapData';

interface HereMapWithDataProps {
  width?: string;
  height?: string;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  showTestMarkers?: boolean;
}

const HereMapWithData: React.FC<HereMapWithDataProps> = ({
  width = '100%',
  height = '400px',
  className = '',
  center = { lat: 51.1657, lng: 10.4515 }, // Deutschland Zentrum
  zoom = 6,
  showTestMarkers = false
}) => {
  const { t } = useTranslation(['common', 'landing']);
  const { currentLanguage } = useLanguageMCP();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const platformRef = useRef<any>(null);
  const uiRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Lade öffentliche Map-Daten
  const { mapData, loading: dataLoading, error: dataError, refetch } = usePublicMapData();

  // HERE API Credentials (aus Secrets)
  const HERE_API_KEY = "rjeU6vqAFPrInyMy3TItiCISLjsfgCBfsBYOgE3MjOU";

  const initializeMap = async () => {
    try {
      console.log('[HERE Maps Data] 🚀 Initializing map with real data...');

      if (!window.H) {
        throw new Error('HERE Maps SDK not loaded');
      }

      // Initialize Platform mit Sprachunterstützung
      const lang = currentLanguage === 'de' ? 'de-DE' : currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
      
      platformRef.current = new window.H.service.Platform({
        'apikey': HERE_API_KEY,
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

        // Add traffic layer
        if (defaultLayers.vector.normal.trafficincidents) {
          mapInstanceRef.current.addLayer(defaultLayers.vector.normal.trafficincidents);
        }

        setMapReady(true);
        console.log('[HERE Maps Data] ✅ Map initialization complete');
      }

    } catch (err) {
      console.error('[HERE Maps Data] ❌ Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Map initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSdkLoad = () => {
    console.log('[HERE Maps Data] ✅ SDK loaded successfully');
    setSdkReady(true);
  };

  const handleSdkError = (errorMessage: string) => {
    console.error('[HERE Maps Data] ❌ SDK loading error:', errorMessage);
    setError(`SDK Loading Error: ${errorMessage}`);
    setIsLoading(false);
  };

  const handleMarkerClick = (item: any) => {
    console.log('[HERE Maps Data] 📍 Marker clicked:', item);
  };

  useEffect(() => {
    if (sdkReady) {
      initializeMap();
    }
  }, [sdkReady, currentLanguage]);

  if (error) {
    return (
      <Alert className="w-full">
        <AlertDescription>
          HERE Maps konnte nicht geladen werden: {error}
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm" 
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Neu laden
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full relative ${className}`} style={{ width, height }}>
      {/* Load HERE Maps SDK */}
      <HereMapModularLoader onLoad={handleSdkLoad} onError={handleSdkError} />
      
      {/* Loading State */}
      {(isLoading || dataLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-700 font-medium">
              {isLoading ? t('landing:map_loading') : t('landing:data_loading')}
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
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />

      {/* Public Map Markers */}
      {mapReady && mapInstanceRef.current && uiRef.current && (
        <PublicMapMarkers
          mapInstance={mapInstanceRef.current}
          uiInstance={uiRef.current}
          mapData={mapData}
          onMarkerClick={handleMarkerClick}
        />
      )}
      
      {/* Map Stats */}
      {mapReady && !isLoading && !dataLoading && (
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

export default HereMapWithData;

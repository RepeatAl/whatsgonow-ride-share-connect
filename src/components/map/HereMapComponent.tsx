
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';

interface HereMapComponentProps {
  width?: string;
  height?: string;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  showTestMarkers?: boolean;
}

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

const HereMapComponent: React.FC<HereMapComponentProps> = ({
  width = '100%',
  height = '400px',
  className = '',
  center = { lat: 52.5, lng: 13.4 }, // Default: Berlin
  zoom = 10,
  showTestMarkers = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const platformRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Test markers for proof of concept
  const testMarkers: MarkerData[] = [
    {
      lat: center.lat + 0.01,
      lng: center.lng + 0.01,
      title: 'Test Marker 1',
      description: 'Hello World - Marker Test'
    },
    {
      lat: center.lat - 0.01,
      lng: center.lng - 0.01,
      title: 'Test Marker 2',
      description: 'Second test marker'
    }
  ];

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load HERE Maps API from CDN
        if (!window.H) {
          await loadHereMapsAPI();
        }

        // Get API key from environment/secrets
        const apiKey = import.meta.env.VITE_HERE_MAPS_API_KEY || 'demo-key';
        
        if (!apiKey || apiKey === 'demo-key') {
          throw new Error('HERE Maps API Key nicht konfiguriert');
        }

        // Initialize HERE Maps Platform
        platformRef.current = new window.H.service.Platform({
          'apikey': apiKey
        });

        // Get default map types
        const defaultLayers = platformRef.current.createDefaultLayers();

        // Initialize map
        if (mapRef.current) {
          mapInstanceRef.current = new window.H.Map(
            mapRef.current,
            defaultLayers.vector.normal.map,
            {
              zoom: zoom,
              center: { lat: center.lat, lng: center.lng }
            }
          );

          // Enable map interaction (pan, zoom)
          const behavior = new window.H.mapevents.Behavior();
          const ui = new window.H.ui.UI.createDefault(mapInstanceRef.current);

          // Add test markers if enabled
          if (showTestMarkers) {
            addTestMarkers();
          }

          setMapReady(true);
        }

      } catch (err) {
        console.error('HERE Maps initialization error:', err);
        setError(err instanceof Error ? err.message : 'Karte konnte nicht geladen werden');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
      }
    };
  }, [center.lat, center.lng, zoom, showTestMarkers]);

  const loadHereMapsAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.H) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.api.here.com/v3/3.1/mapsjs-bundle.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('HERE Maps SDK konnte nicht geladen werden'));
      
      document.head.appendChild(script);
    });
  };

  const addTestMarkers = () => {
    if (!mapInstanceRef.current) return;

    const group = new window.H.map.Group();

    testMarkers.forEach((marker, index) => {
      // Create marker icon
      const icon = new window.H.map.Icon(
        `data:image/svg+xml;base64,${btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#9b87f5"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        `)}`,
        { size: { w: 24, h: 24 } }
      );

      // Create marker
      const mapMarker = new window.H.map.Marker(
        { lat: marker.lat, lng: marker.lng },
        { icon }
      );

      // Add info bubble on tap/click
      mapMarker.addEventListener('tap', (evt: any) => {
        const bubble = new window.H.ui.InfoBubble(marker.title, {
          content: marker.description || ''
        });
        bubble.open(mapInstanceRef.current, { lat: marker.lat, lng: marker.lng });
      });

      group.addObject(mapMarker);
    });

    mapInstanceRef.current.addObject(group);
  };

  // Resize handler for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getViewPort().resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className={`w-full ${className}`} style={{ width, height }}>
        <Alert className="h-full flex items-center justify-center border-red-200 bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
          <div>
            <AlertDescription className="text-red-800 font-medium">
              Karte konnte nicht geladen werden
            </AlertDescription>
            <AlertDescription className="text-red-600 text-sm mt-1">
              Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600 font-medium">Karte wird geladen...</span>
          </div>
        </div>
      )}
      
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ 
          minHeight: '300px',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {mapReady && showTestMarkers && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-purple-600" />
            <span className="text-gray-700">{testMarkers.length} Test Marker</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HereMapComponent;

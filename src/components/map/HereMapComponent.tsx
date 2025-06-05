import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { mockTransports, mockRequests } from '@/data/mockData';
import MapFallback from './MapFallback';
import type { Transport, TransportRequest } from '@/data/mockData';

interface HereMapComponentProps {
  width?: string;
  height?: string;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  showTestMarkers?: boolean;
  showMockData?: boolean;
  showTransports?: boolean;
  showRequests?: boolean;
}

interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  price?: number;
  type: 'test' | 'transport' | 'request';
}

type ErrorType = 'api_key' | 'network' | 'cors' | 'unknown';

// German cities coordinates for demo data
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Berlin': { lat: 52.5200, lng: 13.4050 },
  'Munich': { lat: 48.1351, lng: 11.5820 },
  'München': { lat: 48.1351, lng: 11.5820 },
  'Hamburg': { lat: 53.5511, lng: 9.9937 },
  'Cologne': { lat: 50.9375, lng: 6.9603 },
  'Frankfurt': { lat: 50.1109, lng: 8.6821 },
  'Stuttgart': { lat: 48.7758, lng: 9.1829 },
  'Dresden': { lat: 51.0504, lng: 13.7373 },
  'Leipzig': { lat: 51.3397, lng: 12.3731 },
  'Dusseldorf': { lat: 51.2277, lng: 6.7735 },
  'Dortmund': { lat: 51.5136, lng: 7.4653 }
};

const HereMapComponent: React.FC<HereMapComponentProps> = ({
  width = '100%',
  height = '400px',
  className = '',
  center = { lat: 52.5, lng: 13.4 }, // Default: Berlin
  zoom = 7,
  showTestMarkers = false,
  showMockData = false,
  showTransports = true,
  showRequests = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const platformRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>('unknown');
  const [mapReady, setMapReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Test markers for proof of concept
  const testMarkers: MarkerData[] = [
    {
      lat: center.lat + 0.01,
      lng: center.lng + 0.01,
      title: 'Test Marker 1',
      description: 'Hello World - Marker Test',
      type: 'test'
    },
    {
      lat: center.lat - 0.01,
      lng: center.lng - 0.01,
      title: 'Test Marker 2',
      description: 'Second test marker',
      type: 'test'
    }
  ];

  // Convert mock data to markers
  const createMarkersFromMockData = (): MarkerData[] => {
    const markers: MarkerData[] = [];

    if (showTransports) {
      mockTransports.forEach((transport: Transport) => {
        // From location
        const fromCoords = CITY_COORDINATES[transport.from];
        if (fromCoords) {
          markers.push({
            lat: fromCoords.lat + (Math.random() - 0.5) * 0.01, // Small random offset
            lng: fromCoords.lng + (Math.random() - 0.5) * 0.01,
            title: `Fahrt von ${transport.from}`,
            description: `${transport.from} → ${transport.to} | ${transport.date} | ${transport.price}€ | ${transport.driver.name}`,
            price: transport.price,
            type: 'transport'
          });
        }

        // To location
        const toCoords = CITY_COORDINATES[transport.to];
        if (toCoords) {
          markers.push({
            lat: toCoords.lat + (Math.random() - 0.5) * 0.01,
            lng: toCoords.lng + (Math.random() - 0.5) * 0.01,
            title: `Fahrt nach ${transport.to}`,
            description: `${transport.from} → ${transport.to} | ${transport.date} | ${transport.price}€ | ${transport.driver.name}`,
            price: transport.price,
            type: 'transport'
          });
        }
      });
    }

    if (showRequests) {
      mockRequests.forEach((request: TransportRequest) => {
        // Extract city from location strings (e.g., "Berlin, Alexanderplatz" -> "Berlin")
        const pickupCity = request.pickupLocation.split(',')[0].trim();
        const deliveryCity = request.deliveryLocation.split(',')[0].trim();

        // Pickup location
        const pickupCoords = CITY_COORDINATES[pickupCity];
        if (pickupCoords) {
          markers.push({
            lat: pickupCoords.lat + (Math.random() - 0.5) * 0.01,
            lng: pickupCoords.lng + (Math.random() - 0.5) * 0.01,
            title: `Abholung: ${request.title}`,
            description: `${request.title} | Abholung: ${request.pickupLocation} | Budget: ${request.budget}€`,
            price: request.budget,
            type: 'request'
          });
        }

        // Delivery location
        const deliveryCoords = CITY_COORDINATES[deliveryCity];
        if (deliveryCoords) {
          markers.push({
            lat: deliveryCoords.lat + (Math.random() - 0.5) * 0.01,
            lng: deliveryCoords.lng + (Math.random() - 0.5) * 0.01,
            title: `Lieferung: ${request.title}`,
            description: `${request.title} | Lieferung: ${request.deliveryLocation} | Budget: ${request.budget}€`,
            price: request.budget,
            type: 'request'
          });
        }
      });
    }

    return markers;
  };

  const categorizeError = (err: any): ErrorType => {
    const errorMessage = err?.message?.toLowerCase() || '';
    const errorString = err?.toString?.()?.toLowerCase() || '';
    
    if (errorMessage.includes('api') || errorMessage.includes('key') || errorString.includes('unauthorized')) {
      return 'api_key';
    }
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorString.includes('cors')) {
      return 'network';
    }
    if (errorMessage.includes('csp') || errorMessage.includes('content security policy')) {
      return 'cors';
    }
    
    return 'unknown';
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setErrorType('unknown');
    setIsLoading(true);
    setMapReady(false);
    
    // Clear existing map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.dispose();
      mapInstanceRef.current = null;
    }
    
    console.log(`[HERE Maps] Retry attempt ${retryCount + 1}`);
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('[HERE Maps] Initializing map...');
        console.log('[HERE Maps] HTTPS:', window.location.protocol === 'https:');
        console.log('[HERE Maps] Hostname:', window.location.hostname);

        // Enhanced API key check
        const apiKey = import.meta.env.VITE_HERE_MAPS_API_KEY;
        console.log('[HERE Maps] API Key check:', {
          exists: !!apiKey,
          isDemoKey: apiKey === 'demo-key',
          keyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'None'
        });
        
        if (!apiKey || apiKey === 'demo-key') {
          throw new Error('HERE Maps API Key nicht konfiguriert oder Demo-Key aktiv');
        }

        // Load HERE Maps API from CDN with enhanced error handling
        if (!window.H) {
          console.log('[HERE Maps] Loading SDK from CDN...');
          await loadHereMapsAPI();
          console.log('[HERE Maps] SDK loaded successfully');
        }

        // Initialize HERE Maps Platform
        console.log('[HERE Maps] Initializing Platform...');
        platformRef.current = new window.H.service.Platform({
          'apikey': apiKey
        });

        // Get default map types
        const defaultLayers = platformRef.current.createDefaultLayers();

        // Initialize map
        if (mapRef.current) {
          console.log('[HERE Maps] Creating map instance...');
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

          // Add markers based on configuration
          if (showTestMarkers) {
            addMarkersToMap(testMarkers);
          }
          
          if (showMockData) {
            const mockMarkers = createMarkersFromMockData();
            addMarkersToMap(mockMarkers);
          }

          console.log('[HERE Maps] Map initialized successfully');
          setMapReady(true);
        }

      } catch (err) {
        const errorType = categorizeError(err);
        console.error('[HERE Maps] Initialization error:', {
          error: err,
          type: errorType,
          retryCount,
          stackTrace: err?.stack
        });
        
        setError(err instanceof Error ? err.message : 'Karte konnte nicht geladen werden');
        setErrorType(errorType);
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
  }, [center.lat, center.lng, zoom, showTestMarkers, showMockData, showTransports, showRequests, retryCount]);

  const loadHereMapsAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.H) {
        resolve();
        return;
      }

      console.log('[HERE Maps] Loading SDK from CDN...');
      const script = document.createElement('script');
      script.src = 'https://js.api.here.com/v3/3.1/mapsjs-bundle.js';
      script.async = true;
      
      script.onload = () => {
        console.log('[HERE Maps] SDK loaded successfully from CDN');
        resolve();
      };
      
      script.onerror = (event) => {
        console.error('[HERE Maps] SDK loading failed:', event);
        reject(new Error('HERE Maps SDK konnte nicht geladen werden'));
      };
      
      document.head.appendChild(script);
    });
  };

  const getMarkerColor = (marker: MarkerData): string => {
    if (marker.type === 'test') return '#9b87f5'; // Purple for test markers
    
    const price = marker.price || 0;
    if (price < 15) return '#22c55e'; // Green
    if (price <= 25) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const addMarkersToMap = (markers: MarkerData[]) => {
    if (!mapInstanceRef.current) return;

    const group = new window.H.map.Group();

    markers.forEach((marker, index) => {
      const color = getMarkerColor(marker);
      
      // Create marker icon with color
      const icon = new window.H.map.Icon(
        `data:image/svg+xml;base64,${btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
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

  const getActiveMarkerCount = (): number => {
    let count = 0;
    if (showTestMarkers) count += testMarkers.length;
    if (showMockData) count += createMarkersFromMockData().length;
    return count;
  };

  // Show fallback map if there's an error
  if (error) {
    return (
      <div className={`w-full ${className}`} style={{ width, height }}>
        <MapFallback
          height={height}
          errorType={errorType}
          onRetry={handleRetry}
          showMockData={showMockData}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            <span className="text-gray-600 font-medium">
              HERE Maps wird geladen... {retryCount > 0 && `(Versuch ${retryCount + 1})`}
            </span>
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
      
      {mapReady && (showTestMarkers || showMockData) && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-purple-600" />
            <span className="text-gray-700">{getActiveMarkerCount()} Marker</span>
            {showMockData && (
              <div className="flex space-x-1 ml-2">
                <div className="w-3 h-3 rounded-full bg-green-500" title="< 15€"></div>
                <div className="w-3 h-3 rounded-full bg-orange-500" title="15-25€"></div>
                <div className="w-3 h-3 rounded-full bg-red-500" title="> 25€"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HereMapComponent;

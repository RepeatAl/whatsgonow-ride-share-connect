
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { mockTransports, mockRequests } from '@/data/mockData';
import { supabase } from '@/lib/supabaseClient';
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
  type: 'test' | 'transport' | 'request' | 'pickup';
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

// Available CDN URLs for HERE Maps SDK - STABLE VERSION
const HERE_CDN_URLS = [
  'https://js.api.here.com/v3/3.1/mapsjs-bundle.js',
  'https://cdn.here.com/v3/3.1/mapsjs-bundle.js'
];

// Timeout increased for better loading success rate
const SDK_TIMEOUT_MS = 12000; // Increased to 12 seconds for better reliability

// ⚠️ HARDCODE BEREICH: API Key mit verbesserter Struktur
const HARDCODED_HERE_API_KEY = "rjeU6vqAFPrInyMy3TItiCISLjsfgCBfsBYOgE3MjOU";
const HARDCODED_HERE_APP_ID = "29iqvPg2BRrei4elsIYu";

// Mini-Testdaten für Marker
const TEST_PICKUP_LOCATIONS: MarkerData[] = [
  { lat: 52.5200, lng: 13.4050, title: 'Berlin Alexanderplatz', description: 'Abholung: Paket nach München', price: 25, type: 'pickup' },
  { lat: 48.1351, lng: 11.5820, title: 'München Hauptbahnhof', description: 'Lieferung: Dokumente nach Hamburg', price: 15, type: 'pickup' },
  { lat: 53.5511, lng: 9.9937, title: 'Hamburg Speicherstadt', description: 'Transport: Möbel nach Berlin', price: 45, type: 'pickup' },
  { lat: 50.9375, lng: 6.9603, title: 'Köln Dom', description: 'Express: Medikamente nach Frankfurt', price: 30, type: 'pickup' },
  { lat: 50.1109, lng: 8.6821, title: 'Frankfurt Flughafen', description: 'Abholdienst: Koffer nach Stuttgart', price: 20, type: 'pickup' }
];

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

  // Fetch API key and App ID from Supabase Secrets OR use hardcoded fallback
  const getHereMapCredentials = async (): Promise<{ apiKey: string; appId: string } | null> => {
    // PRIORITY 1: Try hardcoded credentials first (if provided)
    if (HARDCODED_HERE_API_KEY && HARDCODED_HERE_API_KEY.trim() !== "" &&
        HARDCODED_HERE_APP_ID && HARDCODED_HERE_APP_ID.trim() !== "") {
      console.log('[HERE Maps] Using hardcoded credentials');
      return {
        apiKey: HARDCODED_HERE_API_KEY,
        appId: HARDCODED_HERE_APP_ID
      };
    }
    
    try {
      console.log('[HERE Maps] Fetching credentials from Supabase Secrets...');
      
      // Try to get from Edge Function
      const { data, error } = await supabase.functions.invoke('get-here-maps-key');
      
      if (error) {
        console.warn('[HERE Maps] Edge Function error:', error);
        // Fallback to environment variables
        const envKey = import.meta.env.VITE_HERE_MAPS_API_KEY;
        const envAppId = import.meta.env.VITE_HERE_MAPS_APP_ID;
        if (envKey && envKey !== 'demo-key' && envAppId && envAppId !== 'demo-app-id') {
          console.log('[HERE Maps] Using environment fallback');
          return { apiKey: envKey, appId: envAppId };
        }
        throw new Error('HERE Maps credentials nicht verfügbar');
      }
      
      if (data?.apiKey && data?.appId) {
        console.log('[HERE Maps] Credentials erfolgreich von Supabase erhalten');
        return { apiKey: data.apiKey, appId: data.appId };
      }
      
      throw new Error('Credentials nicht in Response gefunden');
    } catch (err) {
      console.error('[HERE Maps] Credentials fetch failed:', err);
      
      // Final fallback to environment variables
      const envKey = import.meta.env.VITE_HERE_MAPS_API_KEY;
      const envAppId = import.meta.env.VITE_HERE_MAPS_APP_ID;
      if (envKey && envKey !== 'demo-key' && envAppId && envAppId !== 'demo-app-id') {
        console.log('[HERE Maps] Using environment fallback after error');
        return { apiKey: envKey, appId: envAppId };
      }
      
      return null;
    }
  };

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
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorString.includes('cors') || errorMessage.includes('timeout')) {
      return 'network';
    }
    if (errorMessage.includes('csp') || errorMessage.includes('content security policy')) {
      return 'cors';
    }
    
    return 'unknown';
  };

  // Enhanced CDN loading function with improved diagnostics and error handling
  const loadHereMapsAPI = async (): Promise<boolean> => {
    // Check if already loaded
    if (window.H) {
      console.log('[HERE Maps] SDK already loaded, reusing existing instance');
      return true;
    }

    console.log(`[HERE Maps] Starting SDK load process with ${SDK_TIMEOUT_MS / 1000}s timeout...`);

    // Try each CDN URL once with increased timeout
    for (const cdnUrl of HERE_CDN_URLS) {
      console.log(`[HERE Maps] Attempting to load SDK from ${cdnUrl}...`);
      
      try {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = cdnUrl;
          script.async = true;
          script.crossOrigin = "anonymous";
          
          // Enhanced loading diagnostics
          script.onload = () => {
            console.log(`[HERE Maps] ✅ Script element loaded from ${cdnUrl}`);
            // Additional check for actual HERE Maps object
            if (window.H) {
              console.log(`[HERE Maps] ✅ HERE Maps SDK fully available`);
              resolve();
            } else {
              console.error(`[HERE Maps] ❌ Script loaded but H object not available`);
              reject(new Error(`HERE SDK loaded but H object missing from ${cdnUrl}`));
            }
          };
          
          script.onerror = (event) => {
            console.error(`[HERE Maps] ❌ Script loading failed from ${cdnUrl}:`, event);
            reject(new Error(`Script loading failed from ${cdnUrl} - Network or CSP error`));
          };
          
          document.head.appendChild(script);
          
          // Increased timeout with better error messages
          setTimeout(() => {
            if (!window.H) {
              console.warn(`[HERE Maps] ⏰ Script loading timed out after ${SDK_TIMEOUT_MS / 1000} seconds from ${cdnUrl}`);
              console.warn(`[HERE Maps] 🔍 Check: 1) Domain whitelist in HERE Developer Portal, 2) CSP headers in vercel.json, 3) Network connectivity`);
              reject(new Error(`Timeout loading from ${cdnUrl} after ${SDK_TIMEOUT_MS / 1000}s`));
            }
          }, SDK_TIMEOUT_MS);
        });

        // Success - SDK loaded
        return true;
      } catch (error) {
        console.warn(`[HERE Maps] ⚠️ Failed to load from ${cdnUrl}:`, error.message);
        console.warn(`[HERE Maps] 🔄 Trying next CDN...`);
        continue;
      }
    }

    // All CDNs failed
    console.error('[HERE Maps] ❌ All CDN URLs failed');
    console.error('[HERE Maps] 🔍 Troubleshooting checklist:');
    console.error('[HERE Maps] 1. Verify domain "preview--whatsgonow-ride-share-connect.lovable.app" in HERE Developer Portal');
    console.error('[HERE Maps] 2. Check CSP headers allow HERE domains in vercel.json');
    console.error('[HERE Maps] 3. Test network connectivity to js.api.here.com');
    console.error('[HERE Maps] 4. Verify API key and App ID are valid and active');
    console.error('[HERE Maps] 5. Ensure HERE Maps API for JavaScript, Map Tile API v3, and Vector Tile API v2 are linked');
    return false;
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('[HERE Maps] 🚀 Initializing map...');

        // Get credentials (API key + App ID)
        const credentials = await getHereMapCredentials();
        if (!credentials) {
          throw new Error('HERE Maps credentials nicht konfiguriert oder nicht verfügbar');
        }

        console.log('[HERE Maps] 🔑 Credentials erfolgreich geladen:', 
          credentials.apiKey.substring(0, 8) + '...', 
          'App ID:', credentials.appId.substring(0, 8) + '...');

        // Load HERE Maps SDK with enhanced diagnostics
        const sdkLoaded = await loadHereMapsAPI();
        if (!sdkLoaded) {
          throw new Error('HERE Maps SDK konnte nicht geladen werden - siehe Console für Details');
        }

        // Verify SDK availability
        if (!window.H) {
          throw new Error('HERE Maps SDK wurde geladen, aber H-Objekt ist nicht verfügbar');
        }

        // Initialize HERE Maps Platform with both API key and App ID
        console.log('[HERE Maps] 🏗️ Initializing Platform with credentials...');
        platformRef.current = new window.H.service.Platform({
          'apikey': credentials.apiKey,
          'app_id': credentials.appId
        });

        // Get default map types
        const defaultLayers = platformRef.current.createDefaultLayers();

        // Initialize map
        if (mapRef.current) {
          console.log('[HERE Maps] 🗺️ Creating map instance...');
          mapInstanceRef.current = new window.H.Map(
            mapRef.current,
            defaultLayers.vector.normal.map,
            {
              zoom: zoom,
              center: { lat: center.lat, lng: center.lng }
            }
          );

          // Enable map interaction (pan, zoom)
          const behavior = new window.H.mapevents.Behavior(
            new window.H.mapevents.MapEvents(mapInstanceRef.current)
          );
          
          // Add UI components
          const ui = window.H.ui.UI.createDefault(mapInstanceRef.current, defaultLayers);

          // Add markers based on configuration
          let allMarkers: MarkerData[] = [];
          
          if (showTestMarkers) {
            allMarkers = [...allMarkers, ...testMarkers];
          }
          
          if (showMockData) {
            const mockMarkers = createMarkersFromMockData();
            allMarkers = [...allMarkers, ...mockMarkers];
          }

          // Always add pickup test markers for demo
          allMarkers = [...allMarkers, ...TEST_PICKUP_LOCATIONS];

          if (allMarkers.length > 0) {
            addMarkersToMap(allMarkers);
          }

          console.log('[HERE Maps] ✅ Map initialized successfully');
          setMapReady(true);
        }

      } catch (err) {
        const errorType = categorizeError(err);
        console.error('[HERE Maps] ❌ Initialization error:', {
          error: err,
          type: errorType,
          message: err?.message,
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
  }, [center.lat, center.lng, zoom, showTestMarkers, showMockData, showTransports, showRequests]);

  const getMarkerColor = (marker: MarkerData): string => {
    if (marker.type === 'test') return '#9b87f5'; // Purple for test markers
    if (marker.type === 'pickup') return '#3b82f6'; // Blue for pickup locations
    
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
        const bubble = new window.H.ui.InfoBubble(
          { lat: marker.lat, lng: marker.lng },
          { content: `<div><b>${marker.title}</b><br/>${marker.description || ''}</div>` }
        );
        bubble.open();
      });

      group.addObject(mapMarker);
    });

    mapInstanceRef.current.addObject(group);
    
    // Ensure all markers are visible
    if (markers.length > 0) {
      mapInstanceRef.current.getViewModel().setLookAtData({
        bounds: group.getBoundingBox()
      });
    }
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
    let count = TEST_PICKUP_LOCATIONS.length; // Always include pickup locations
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
          showMockData={showMockData}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              <span className="text-gray-600 font-medium">
                HERE Maps wird geladen...
              </span>
            </div>
            <div className="text-xs text-gray-500 text-center max-w-md">
              Timeout erhöht auf {SDK_TIMEOUT_MS / 1000}s für bessere Kompatibilität
            </div>
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
      
      {mapReady && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{getActiveMarkerCount()} Standorte</span>
            <div className="flex space-x-1 ml-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" title="Abholorte"></div>
              <div className="w-3 h-3 rounded-full bg-green-500" title="< 15€"></div>
              <div className="w-3 h-3 rounded-full bg-orange-500" title="15-25€"></div>
              <div className="w-3 h-3 rounded-full bg-red-500" title="> 25€"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HereMapComponent;

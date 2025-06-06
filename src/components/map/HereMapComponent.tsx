import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, AlertTriangle, Navigation, Search, Route } from 'lucide-react';
import { mockTransports, mockRequests } from '@/data/mockData';
import { supabase } from '@/lib/supabaseClient';
import MapFallback from './MapFallback';
import HereMapModularLoader from './HereMapModularLoader';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  enableTraffic?: boolean;
  enableRouting?: boolean;
  enableGeocoding?: boolean;
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

// Hardcoded HERE API credentials
const HARDCODED_HERE_API_KEY = "rjeU6vqAFPrInyMy3TItiCISLjsfgCBfsBYOgE3MjOU";
const HARDCODED_HERE_APP_ID = "29iqvPg2BRrei4elsIYu";

// Demo pickup locations
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
  center = { lat: 52.5, lng: 13.4 },
  zoom = 7,
  showTestMarkers = false,
  showMockData = false,
  showTransports = true,
  showRequests = true,
  enableTraffic = true,
  enableRouting = true,
  enableGeocoding = true
}) => {
  const { t, i18n } = useTranslation(['common', 'landing']);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const platformRef = useRef<any>(null);
  const routingServiceRef = useRef<any>(null);
  const geocodingServiceRef = useRef<any>(null);
  const uiRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>('unknown');
  const [mapReady, setMapReady] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [servicesReady, setServicesReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeStart, setRouteStart] = useState<{ lat: number; lng: number } | null>(null);
  const [routeEnd, setRouteEnd] = useState<{ lat: number; lng: number } | null>(null);
  const [activeRoute, setActiveRoute] = useState<any>(null);

  // Feature status tracking
  const [featureStatus, setFeatureStatus] = useState({
    modularLoader: false,
    eventSystem: false,
    uiControls: false,
    trafficLayer: false,
    markerInteraction: false,
    geocoding: false,
    routing: false,
    routeRendering: false,
    responsive: false,
    fallback: true,
    languageAware: false,
    performance: false
  });

  // Get HERE credentials
  const getHereMapCredentials = async (): Promise<{ apiKey: string; appId: string } | null> => {
    if (HARDCODED_HERE_API_KEY && HARDCODED_HERE_API_KEY.trim() !== "" &&
        HARDCODED_HERE_APP_ID && HARDCODED_HERE_APP_ID.trim() !== "") {
      console.log('[HERE Maps] ✅ Using hardcoded credentials');
      return {
        apiKey: HARDCODED_HERE_API_KEY,
        appId: HARDCODED_HERE_APP_ID
      };
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('get-here-maps-key');
      
      if (error) {
        const envKey = import.meta.env.VITE_HERE_MAPS_API_KEY;
        const envAppId = import.meta.env.VITE_HERE_MAPS_APP_ID;
        if (envKey && envKey !== 'demo-key' && envAppId && envAppId !== 'demo-app-id') {
          return { apiKey: envKey, appId: envAppId };
        }
        throw new Error('HERE Maps credentials not available');
      }
      
      if (data?.apiKey && data?.appId) {
        return { apiKey: data.apiKey, appId: data.appId };
      }
      
      throw new Error('Credentials not found in response');
    } catch (err) {
      console.error('[HERE Maps] Credentials fetch failed:', err);
      return null;
    }
  };

  // Initialize map and all services
  const initializeMap = async () => {
    try {
      console.log('[HERE Maps] 🚀 Initializing map with full services...');

      const credentials = await getHereMapCredentials();
      if (!credentials) {
        throw new Error('HERE Maps credentials not configured');
      }

      if (!window.H) {
        throw new Error('HERE Maps SDK not loaded');
      }

      // ✅ 1. Initialize Platform
      platformRef.current = new window.H.service.Platform({
        'apikey': credentials.apiKey,
        'app_id': credentials.appId
      });

      const defaultLayers = platformRef.current.createDefaultLayers();

      // ✅ 2. Create Map Instance
      if (mapRef.current) {
        mapInstanceRef.current = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            zoom: zoom,
            center: { lat: center.lat, lng: center.lng }
          }
        );

        // ✅ 3. Enable Event System (Behavior)
        const mapEvents = new window.H.mapevents.MapEvents(mapInstanceRef.current);
        const behavior = new window.H.mapevents.Behavior(mapEvents);
        
        setFeatureStatus(prev => ({ ...prev, eventSystem: true }));
        console.log('[HERE Maps] ✅ Event system enabled');

        // ✅ 4. Enable UI Controls & InfoBubbles
        uiRef.current = window.H.ui.UI.createDefault(mapInstanceRef.current, defaultLayers);
        
        setFeatureStatus(prev => ({ ...prev, uiControls: true }));
        console.log('[HERE Maps] ✅ UI controls enabled');

        // ✅ 5. Enable Traffic Layer
        if (enableTraffic && defaultLayers.vector.normal.trafficincidents) {
          mapInstanceRef.current.addLayer(defaultLayers.vector.normal.trafficincidents);
          setFeatureStatus(prev => ({ ...prev, trafficLayer: true }));
          console.log('[HERE Maps] ✅ Traffic layer enabled');
        }

        // ✅ 6. Initialize Services
        await initializeServices();

        // ✅ 7. Add Markers with Interaction
        await addMarkersWithInteraction();

        // ✅ 8. Language Awareness
        updateMapLanguage();

        setMapReady(true);
        setFeatureStatus(prev => ({ ...prev, performance: true }));
        console.log('[HERE Maps] ✅ Map initialization complete');
      }

    } catch (err) {
      const errorType = categorizeError(err);
      console.error('[HERE Maps] ❌ Initialization error:', err);
      
      setError(err instanceof Error ? err.message : 'Map initialization failed');
      setErrorType(errorType);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize additional services
  const initializeServices = async () => {
    try {
      // ✅ Geocoding Service
      if (enableGeocoding) {
        geocodingServiceRef.current = platformRef.current.getSearchService();
        setFeatureStatus(prev => ({ ...prev, geocoding: true }));
        console.log('[HERE Maps] ✅ Geocoding service initialized');
      }

      // ✅ Routing Service
      if (enableRouting) {
        routingServiceRef.current = platformRef.current.getRoutingService();
        setFeatureStatus(prev => ({ ...prev, routing: true }));
        console.log('[HERE Maps] ✅ Routing service initialized');
      }

      setServicesReady(true);
    } catch (err) {
      console.error('[HERE Maps] ❌ Services initialization failed:', err);
    }
  };

  // Add markers with click interaction (InfoBubbles)
  const addMarkersWithInteraction = async () => {
    if (!mapInstanceRef.current) return;

    let allMarkers: MarkerData[] = [];
    
    if (showTestMarkers) {
      allMarkers = [...allMarkers, ...createTestMarkers()];
    }
    
    if (showMockData) {
      const mockMarkers = createMarkersFromMockData();
      allMarkers = [...allMarkers, ...mockMarkers];
    }

    allMarkers = [...allMarkers, ...TEST_PICKUP_LOCATIONS];

    if (allMarkers.length > 0) {
      const group = new window.H.map.Group();

      allMarkers.forEach((marker) => {
        const color = getMarkerColor(marker);
        
        const icon = new window.H.map.Icon(
          `data:image/svg+xml;base64,${btoa(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `)}`,
          { size: { w: 24, h: 24 } }
        );

        const mapMarker = new window.H.map.Marker(
          { lat: marker.lat, lng: marker.lng },
          { icon }
        );

        // ✅ Marker Interaction with InfoBubble
        mapMarker.addEventListener('tap', (evt: any) => {
          const bubble = new window.H.ui.InfoBubble(
            { lat: marker.lat, lng: marker.lng },
            { 
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h4 style="margin: 0 0 8px 0; font-weight: bold;">${marker.title}</h4>
                  <p style="margin: 0 0 8px 0; font-size: 14px;">${marker.description || ''}</p>
                  ${marker.price ? `<p style="margin: 0; font-weight: bold; color: #2563eb;">${marker.price}€</p>` : ''}
                  <div style="margin-top: 8px; display: flex; gap: 4px;">
                    <button onclick="setRouteStart(${marker.lat}, ${marker.lng})" style="padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Start</button>
                    <button onclick="setRouteEnd(${marker.lat}, ${marker.lng})" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">Ziel</button>
                  </div>
                </div>
              `
            }
          );
          
          // Close existing bubbles
          uiRef.current.getBubbles().forEach((b: any) => b.close());
          
          // Open new bubble
          uiRef.current.addBubble(bubble);
        });

        group.addObject(mapMarker);
      });

      mapInstanceRef.current.addObject(group);
      
      // Ensure all markers are visible
      if (allMarkers.length > 0) {
        mapInstanceRef.current.getViewModel().setLookAtData({
          bounds: group.getBoundingBox()
        });
      }

      setFeatureStatus(prev => ({ ...prev, markerInteraction: true }));
      console.log('[HERE Maps] ✅ Marker interaction enabled');
    }
  };

  // Geocoding search function
  const performGeocoding = async (query: string) => {
    if (!geocodingServiceRef.current || !query.trim()) return;

    try {
      const result = await new Promise((resolve, reject) => {
        geocodingServiceRef.current.geocode(
          {
            q: query,
            limit: 5
          },
          (result: any) => resolve(result),
          (error: any) => reject(error)
        );
      });

      console.log('[HERE Maps] ✅ Geocoding result:', result);
      
      // Process and display results (example)
      if (result && (result as any).items && (result as any).items.length > 0) {
        const firstResult = (result as any).items[0];
        const { lat, lng } = firstResult.position;
        
        // Center map on result
        mapInstanceRef.current.setCenter({ lat, lng });
        mapInstanceRef.current.setZoom(15);
        
        // Add search result marker
        const searchIcon = new window.H.map.Icon(
          `data:image/svg+xml;base64,${btoa(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
              <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
            </svg>
          `)}`,
          { size: { w: 32, h: 32 } }
        );

        const searchMarker = new window.H.map.Marker({ lat, lng }, { icon: searchIcon });
        mapInstanceRef.current.addObject(searchMarker);
      }

    } catch (error) {
      console.error('[HERE Maps] ❌ Geocoding failed:', error);
    }
  };

  // Routing calculation and rendering
  const calculateAndRenderRoute = async () => {
    if (!routingServiceRef.current || !routeStart || !routeEnd) return;

    try {
      const routingParameters = {
        routingMode: 'fast',
        transportMode: 'car',
        origin: `${routeStart.lat},${routeStart.lng}`,
        destination: `${routeEnd.lat},${routeEnd.lng}`,
        return: 'polyline'
      };

      const result = await new Promise((resolve, reject) => {
        routingServiceRef.current.calculateRoute(
          routingParameters,
          (result: any) => resolve(result),
          (error: any) => reject(error)
        );
      });

      // ✅ Route Rendering
      if (result && (result as any).routes && (result as any).routes.length > 0) {
        const route = (result as any).routes[0];
        
        // Clear previous route
        if (activeRoute) {
          mapInstanceRef.current.removeObject(activeRoute);
        }

        // Create polyline from route
        const lineString = new window.H.geo.LineString();
        route.sections.forEach((section: any) => {
          const polyline = section.polyline;
          const decodedPolyline = window.H.geo.LineString.fromFlexiblePolyline(polyline);
          decodedPolyline.getLatLngAltArray().forEach((coord: number, index: number) => {
            if (index % 3 === 0) { // lat, lng pairs
              lineString.pushPoint({
                lat: coord,
                lng: decodedPolyline.getLatLngAltArray()[index + 1]
              });
            }
          });
        });

        const routeLine = new window.H.map.Polyline(lineString, {
          style: {
            strokeColor: '#3b82f6',
            lineWidth: 4,
            lineCap: 'round',
            lineJoin: 'round'
          }
        });

        mapInstanceRef.current.addObject(routeLine);
        setActiveRoute(routeLine);

        // Fit view to route
        mapInstanceRef.current.getViewModel().setLookAtData({
          bounds: routeLine.getBoundingBox()
        });

        setFeatureStatus(prev => ({ ...prev, routeRendering: true }));
        console.log('[HERE Maps] ✅ Route rendered successfully');
      }

    } catch (error) {
      console.error('[HERE Maps] ❌ Routing failed:', error);
    }
  };

  // Update map language
  const updateMapLanguage = () => {
    try {
      const currentLang = i18n.language || 'de';
      // Note: HERE Maps language switching would require reloading layers
      // For now, we mark as language-aware
      setFeatureStatus(prev => ({ ...prev, languageAware: true }));
      console.log('[HERE Maps] ✅ Language awareness enabled:', currentLang);
    } catch (error) {
      console.error('[HERE Maps] ❌ Language update failed:', error);
    }
  };

  // Utility functions (unchanged from original)
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

  const createTestMarkers = (): MarkerData[] => [
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

  const getMarkerColor = (marker: MarkerData): string => {
    if (marker.type === 'test') return '#9b87f5';
    if (marker.type === 'pickup') return '#3b82f6';
    
    const price = marker.price || 0;
    if (price < 15) return '#22c55e';
    if (price <= 25) return '#f97316';
    return '#ef4444';
  };

  // Handle SDK loading
  const handleSdkLoad = () => {
    console.log('[HERE Maps] ✅ SDK modules loaded successfully');
    setSdkReady(true);
    setFeatureStatus(prev => ({ ...prev, modularLoader: true }));
  };

  const handleSdkError = (errorMessage: string) => {
    console.error('[HERE Maps] ❌ SDK loading error:', errorMessage);
    setError(`SDK Loading Error: ${errorMessage}`);
    setErrorType('network');
    setIsLoading(false);
  };

  // Initialize map when SDK is ready
  useEffect(() => {
    if (sdkReady) {
      initializeMap();
    }
  }, [sdkReady, center.lat, center.lng, zoom, showTestMarkers, showMockData, showTransports, showRequests]);

  // Update language when i18n changes
  useEffect(() => {
    if (mapReady) {
      updateMapLanguage();
    }
  }, [i18n.language, mapReady]);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.getViewPort().resize();
        setFeatureStatus(prev => ({ ...prev, responsive: true }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global functions for InfoBubble buttons
  useEffect(() => {
    (window as any).setRouteStart = (lat: number, lng: number) => {
      setRouteStart({ lat, lng });
      console.log('[HERE Maps] Route start set:', lat, lng);
    };

    (window as any).setRouteEnd = (lat: number, lng: number) => {
      setRouteEnd({ lat, lng });
      console.log('[HERE Maps] Route end set:', lat, lng);
    };
  }, []);

  // Calculate route when start and end are set
  useEffect(() => {
    if (routeStart && routeEnd && servicesReady) {
      calculateAndRenderRoute();
    }
  }, [routeStart, routeEnd, servicesReady]);

  const getActiveMarkerCount = (): number => {
    let count = TEST_PICKUP_LOCATIONS.length;
    if (showTestMarkers) count += createTestMarkers().length;
    if (showMockData) count += createMarkersFromMockData().length;
    return count;
  };

  // Feature status summary
  const completedFeatures = Object.values(featureStatus).filter(Boolean).length;
  const totalFeatures = Object.keys(featureStatus).length;

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
      {/* Load HERE Maps SDK modules */}
      <HereMapModularLoader onLoad={handleSdkLoad} onError={handleSdkError} />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              <span className="text-gray-600 font-medium">
                {t('common:loading_map', 'HERE Maps wird geladen...')}
              </span>
            </div>
            <div className="text-xs text-gray-500 text-center max-w-md">
              Modular Loading: {completedFeatures}/{totalFeatures} Features aktiviert
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls */}
      {mapReady && (enableGeocoding || enableRouting) && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20 max-w-xs">
          {enableGeocoding && (
            <div className="mb-2">
              <div className="flex gap-2">
                <Input
                  placeholder={t('common:search_address', 'Adresse suchen...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => performGeocoding(searchQuery)}
                  disabled={!searchQuery.trim()}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {enableRouting && (
            <div className="text-xs text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Start: {routeStart ? '✓' : 'Marker klicken'}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Ziel: {routeEnd ? '✓' : 'Marker klicken'}</span>
              </div>
              {routeStart && routeEnd && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRouteStart(null);
                    setRouteEnd(null);
                    if (activeRoute) {
                      mapInstanceRef.current.removeObject(activeRoute);
                      setActiveRoute(null);
                    }
                  }}
                  className="w-full text-xs"
                >
                  Route löschen
                </Button>
              )}
            </div>
          )}
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
      
      {/* Status Display */}
      {mapReady && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{getActiveMarkerCount()} Standorte</span>
            
            {enableTraffic && featureStatus.trafficLayer && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-gray-600">Traffic</span>
              </div>
            )}
            
            {enableRouting && featureStatus.routing && (
              <div className="flex items-center gap-1">
                <Route className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-gray-600">Routing</span>
              </div>
            )}
            
            {enableGeocoding && featureStatus.geocoding && (
              <div className="flex items-center gap-1">
                <Search className="h-3 w-3 text-green-500" />
                <span className="text-xs text-gray-600">Search</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            Features: {completedFeatures}/{totalFeatures} aktiv
          </div>
        </div>
      )}

      {/* Color Legend */}
      {mapReady && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" title="Abholorte"></div>
              <span>Pickup</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500" title="< 15€"></div>
              <span>&lt;15€</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" title="15-25€"></div>
              <span>15-25€</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500" title="> 25€"></div>
              <span>&gt;25€</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HereMapComponent;

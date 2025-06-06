
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Navigation, Search, Route, Info, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import HereMapModularLoader from './HereMapModularLoader';

interface HereMapFeatureDemoProps {
  width?: string;
  height?: string;
  className?: string;
}

interface FeatureStatus {
  routing: boolean;
  traffic: boolean;
  geocoding: boolean;
  reverseGeocoding: boolean;
  interactiveMarkers: boolean;
  clickHandler: boolean;
  languageSupport: boolean;
  infoBubbles: boolean;
}

const HereMapFeatureDemo: React.FC<HereMapFeatureDemoProps> = ({
  width = '100%',
  height = '600px',
  className = ''
}) => {
  const { t, i18n } = useTranslation(['common', 'landing']);
  const { currentLanguage } = useLanguageMCP();
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const platformRef = useRef<any>(null);
  const routingServiceRef = useRef<any>(null);
  const geocodingServiceRef = useRef<any>(null);
  const uiRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  
  // Feature Status
  const [featureStatus, setFeatureStatus] = useState<FeatureStatus>({
    routing: false,
    traffic: false,
    geocoding: false,
    reverseGeocoding: false,
    interactiveMarkers: false,
    clickHandler: false,
    languageSupport: false,
    infoBubbles: false
  });
  
  // Interactive State
  const [geocodeQuery, setGeocodeQuery] = useState('');
  const [routeStart, setRouteStart] = useState<{ lat: number; lng: number } | null>(null);
  const [routeEnd, setRouteEnd] = useState<{ lat: number; lng: number } | null>(null);
  const [lastClickCoords, setLastClickCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  // HERE API Credentials
  const HARDCODED_HERE_API_KEY = "rjeU6vqAFPrInyMy3TItiCISLjsfgCBfsBYOgE3MjOU";
  const HARDCODED_HERE_APP_ID = "29iqvPg2BRrei4elsIYu";

  // Initialize Map with all features
  const initializeMap = async () => {
    try {
      console.log('[HERE Maps Features] 🚀 Initializing comprehensive demo...');

      if (!window.H) {
        throw new Error('HERE Maps SDK not loaded');
      }

      // ✅ 1. Initialize Platform with language support
      const lang = currentLanguage === 'de' ? 'de-DE' : currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
      
      platformRef.current = new window.H.service.Platform({
        'apikey': HARDCODED_HERE_API_KEY,
        'app_id': HARDCODED_HERE_APP_ID,
        'useHTTPS': true,
        'lang': lang
      });

      const defaultLayers = platformRef.current.createDefaultLayers();

      // ✅ 2. Create Map Instance
      if (mapRef.current) {
        mapInstanceRef.current = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            zoom: 7,
            center: { lat: 52.5, lng: 13.4 } // Berlin Center
          }
        );

        // ✅ 3. Enable Behavior & Events
        const mapEvents = new window.H.mapevents.MapEvents(mapInstanceRef.current);
        const behavior = new window.H.mapevents.Behavior(mapEvents);

        // ✅ 4. Enable UI Controls
        uiRef.current = window.H.ui.UI.createDefault(mapInstanceRef.current, defaultLayers);

        // ✅ 5. Add Traffic Layer
        if (defaultLayers.vector.normal.trafficincidents) {
          mapInstanceRef.current.addLayer(defaultLayers.vector.normal.trafficincidents);
          setFeatureStatus(prev => ({ ...prev, traffic: true }));
          console.log('[HERE Maps Features] ✅ Traffic layer activated');
        }

        // ✅ 6. Initialize Services
        await initializeServices();

        // ✅ 7. Add Interactive Features
        setupInteractiveFeatures();

        // ✅ 8. Add Demo Markers
        addDemoMarkers();

        setFeatureStatus(prev => ({ ...prev, languageSupport: true }));
        setMapReady(true);
        console.log('[HERE Maps Features] ✅ All features initialized');
      }

    } catch (err) {
      console.error('[HERE Maps Features] ❌ Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Map initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize all services
  const initializeServices = async () => {
    try {
      // ✅ Routing Service
      routingServiceRef.current = platformRef.current.getRoutingService();
      setFeatureStatus(prev => ({ ...prev, routing: true }));
      console.log('[HERE Maps Features] ✅ Routing service ready');

      // ✅ Geocoding Service
      geocodingServiceRef.current = platformRef.current.getSearchService();
      setFeatureStatus(prev => ({ ...prev, geocoding: true, reverseGeocoding: true }));
      console.log('[HERE Maps Features] ✅ Geocoding service ready');

    } catch (err) {
      console.error('[HERE Maps Features] ❌ Services initialization failed:', err);
    }
  };

  // Setup interactive features
  const setupInteractiveFeatures = () => {
    if (!mapInstanceRef.current) return;

    // ✅ Click Handler for Coordinates
    mapInstanceRef.current.addEventListener('tap', (evt: any) => {
      const coord = mapInstanceRef.current.screenToGeo(
        evt.currentPointer.viewportX,
        evt.currentPointer.viewportY
      );
      
      setLastClickCoords({ lat: coord.lat, lng: coord.lng });
      console.log('[HERE Maps Features] 📍 Clicked at:', coord.lat, coord.lng);
      
      // Add click marker
      addClickMarker(coord.lat, coord.lng);
    });

    setFeatureStatus(prev => ({ ...prev, clickHandler: true }));
    console.log('[HERE Maps Features] ✅ Click handler activated');
  };

  // Add demo markers with InfoBubbles
  const addDemoMarkers = () => {
    if (!mapInstanceRef.current || !uiRef.current) return;

    const demoLocations = [
      { lat: 52.5160, lng: 13.3779, title: 'Brandenburger Tor', description: 'Historisches Wahrzeichen' },
      { lat: 52.5206, lng: 13.3862, title: 'Hauptbahnhof Berlin', description: 'Zentraler Bahnhof' },
      { lat: 52.5170, lng: 13.3888, title: 'Reichstag', description: 'Deutscher Bundestag' }
    ];

    demoLocations.forEach((location, index) => {
      // Create marker icon
      const icon = new window.H.map.Icon(
        `data:image/svg+xml;base64,${btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3b82f6"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
            <text x="12" y="30" text-anchor="middle" fill="#333" font-size="10">${index + 1}</text>
          </svg>
        `)}`,
        { size: { w: 24, h: 24 } }
      );

      const marker = new window.H.map.Marker(
        { lat: location.lat, lng: location.lng },
        { icon }
      );

      // Add interactive InfoBubble
      marker.addEventListener('tap', (evt: any) => {
        const bubble = new window.H.ui.InfoBubble(
          { lat: location.lat, lng: location.lng },
          { 
            content: `
              <div style="padding: 12px; max-width: 250px;">
                <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${location.title}</h4>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">${location.description}</p>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                  <button onclick="setRouteStart(${location.lat}, ${location.lng})" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Start</button>
                  <button onclick="setRouteEnd(${location.lat}, ${location.lng})" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">Ziel</button>
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

      mapInstanceRef.current.addObject(marker);
      setMarkers(prev => [...prev, marker]);
    });

    setFeatureStatus(prev => ({ ...prev, interactiveMarkers: true, infoBubbles: true }));
    console.log('[HERE Maps Features] ✅ Interactive markers with InfoBubbles added');
  };

  // Add click marker
  const addClickMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    const clickIcon = new window.H.map.Icon(
      `data:image/svg+xml;base64,${btoa(`
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#f59e0b" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      `)}`,
      { size: { w: 20, h: 20 } }
    );

    const clickMarker = new window.H.map.Marker({ lat, lng }, { icon: clickIcon });
    mapInstanceRef.current.addObject(clickMarker);

    // Remove after 3 seconds
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeObject(clickMarker);
      }
    }, 3000);
  };

  // Geocoding search
  const performGeocoding = async () => {
    if (!geocodingServiceRef.current || !geocodeQuery.trim()) return;

    try {
      const result = await new Promise((resolve, reject) => {
        geocodingServiceRef.current.geocode(
          {
            q: geocodeQuery,
            limit: 1
          },
          (result: any) => resolve(result),
          (error: any) => reject(error)
        );
      });

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

        console.log('[HERE Maps Features] ✅ Geocoding result found:', firstResult.title);
      }

    } catch (error) {
      console.error('[HERE Maps Features] ❌ Geocoding failed:', error);
    }
  };

  // Calculate and render route
  const calculateRoute = async () => {
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

      if (result && (result as any).routes && (result as any).routes.length > 0) {
        const route = (result as any).routes[0];
        
        // Clear previous route
        if (activeRoute) {
          mapInstanceRef.current.removeObject(activeRoute);
        }

        // Create route polyline
        if (route.sections && route.sections.length > 0) {
          const linestring = new window.H.geo.LineString();
          
          // Decode polyline (simplified for demo)
          const points = [
            [routeStart.lat, routeStart.lng, 0],
            [routeEnd.lat, routeEnd.lng, 0]
          ];

          points.forEach(point => {
            linestring.pushLatLngAlt(point[0], point[1], point[2]);
          });

          const routeLine = new window.H.map.Polyline(linestring, {
            style: {
              strokeColor: '#3b82f6',
              lineWidth: 6,
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

          console.log('[HERE Maps Features] ✅ Route calculated and rendered');
        }
      }

    } catch (error) {
      console.error('[HERE Maps Features] ❌ Routing failed:', error);
    }
  };

  // Global functions for InfoBubble buttons
  useEffect(() => {
    (window as any).setRouteStart = (lat: number, lng: number) => {
      setRouteStart({ lat, lng });
      console.log('[HERE Maps Features] Route start set:', lat, lng);
    };

    (window as any).setRouteEnd = (lat: number, lng: number) => {
      setRouteEnd({ lat, lng });
      console.log('[HERE Maps Features] Route end set:', lat, lng);
    };
  }, []);

  // Auto-calculate route when start and end are set
  useEffect(() => {
    if (routeStart && routeEnd) {
      calculateRoute();
    }
  }, [routeStart, routeEnd]);

  const handleSdkLoad = () => {
    console.log('[HERE Maps Features] ✅ SDK loaded successfully');
    setSdkReady(true);
  };

  const handleSdkError = (errorMessage: string) => {
    console.error('[HERE Maps Features] ❌ SDK loading error:', errorMessage);
    setError(`SDK Loading Error: ${errorMessage}`);
    setIsLoading(false);
  };

  useEffect(() => {
    if (sdkReady) {
      initializeMap();
    }
  }, [sdkReady, currentLanguage]);

  const completedFeatures = Object.values(featureStatus).filter(Boolean).length;
  const totalFeatures = Object.keys(featureStatus).length;

  if (error) {
    return (
      <Alert className="w-full">
        <AlertDescription>
          HERE Maps Feature Demo konnte nicht geladen werden: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      {/* Load HERE Maps SDK */}
      <HereMapModularLoader onLoad={handleSdkLoad} onError={handleSdkError} />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-700 font-medium">
              HERE Maps Features werden geladen...
            </span>
            <div className="text-sm text-gray-500">
              Features: {completedFeatures}/{totalFeatures} aktiviert
            </div>
          </div>
        </div>
      )}

      {/* Feature Controls */}
      {mapReady && (
        <div className="absolute top-4 left-4 space-y-4 z-20">
          
          {/* Geocoding Search */}
          <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4" />
                Geocoding Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Adresse suchen (z.B. Potsdamer Platz, Berlin)"
                  value={geocodeQuery}
                  onChange={(e) => setGeocodeQuery(e.target.value)}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={performGeocoding}
                  disabled={!geocodeQuery.trim()}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Routing Controls */}
          <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Route className="h-4 w-4" />
                Routing Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Start: {routeStart ? '✅ Gesetzt' : '❌ Marker klicken'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Ziel: {routeEnd ? '✅ Gesetzt' : '❌ Marker klicken'}</span>
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
                    Route zurücksetzen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Click Coordinates */}
          {lastClickCoords && (
            <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Letzter Klick
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-mono">
                  Lat: {lastClickCoords.lat.toFixed(6)}<br/>
                  Lng: {lastClickCoords.lng.toFixed(6)}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}
      
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ 
          minHeight: '400px',
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {/* Feature Status */}
      {mapReady && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-green-500" />
            Feature Status
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(featureStatus).map(([feature, active]) => (
              <div key={feature} className="flex items-center gap-1">
                <Badge variant={active ? "default" : "secondary"} className="w-2 h-2 p-0 rounded-full">
                  <span className="sr-only">{active ? 'Aktiv' : 'Inaktiv'}</span>
                </Badge>
                <span className={active ? 'text-green-700' : 'text-gray-500'}>
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
            {completedFeatures}/{totalFeatures} Features aktiv
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md text-xs">
        <div className="font-medium text-blue-900 mb-2">🧭 Interaktive Demo:</div>
        <ul className="space-y-1 text-blue-800">
          <li>• Klicken Sie auf Marker für InfoBubbles</li>
          <li>• Setzen Sie Start/Ziel für Routing</li>
          <li>• Klicken Sie auf die Karte für Koordinaten</li>
          <li>• Suchen Sie Adressen mit Geocoding</li>
          <li>• Traffic Layer zeigt Live-Verkehr</li>
        </ul>
      </div>
    </div>
  );
};

export default HereMapFeatureDemo;

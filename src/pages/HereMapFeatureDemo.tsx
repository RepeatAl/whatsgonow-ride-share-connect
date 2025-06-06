
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { HereMapComponent } from '@/components/map';
import HereMapFeatureStatus from '@/components/map/HereMapFeatureStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Map, Settings, Info } from 'lucide-react';

const HereMapFeatureDemo = () => {
  const { t } = useTranslation(['common', 'landing']);
  
  // Mock feature status for demo
  const [featureStatus] = useState({
    modularLoader: true,
    eventSystem: true,
    uiControls: true,
    trafficLayer: true,
    markerInteraction: true,
    geocoding: true,
    routing: true,
    routeRendering: false, // Will be true after route calculation
    responsive: true,
    fallback: true,
    languageAware: true,
    performance: true
  });

  const [mapSettings, setMapSettings] = useState({
    showMockData: true,
    showTestMarkers: false,
    showTransports: true,
    showRequests: true,
    enableTraffic: true,
    enableRouting: true,
    enableGeocoding: true
  });

  const updateSetting = (key: string, value: boolean) => {
    setMapSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Map className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                HERE Maps Feature Demo
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Vollständige Integration aller HERE Maps Services: Modular Loading, Event System, 
              Traffic Layer, Routing, Geocoding und erweiterte Interaktionen.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Main Map */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Produktionsreife HERE Maps Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <HereMapComponent
                    height="600px"
                    center={{ lat: 51.1657, lng: 10.4515 }} // Center of Germany
                    zoom={6}
                    showMockData={mapSettings.showMockData}
                    showTestMarkers={mapSettings.showTestMarkers}
                    showTransports={mapSettings.showTransports}
                    showRequests={mapSettings.showRequests}
                    enableTraffic={mapSettings.enableTraffic}
                    enableRouting={mapSettings.enableRouting}
                    enableGeocoding={mapSettings.enableGeocoding}
                    className="rounded-lg overflow-hidden"
                  />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Interaktive Features testen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">🎯 Marker Interaction</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Klicken Sie auf einen Marker um InfoBubble zu öffnen
                      </p>
                      <div className="text-xs text-blue-700">
                        ✅ Click Events aktiviert<br/>
                        ✅ InfoBubbles verfügbar<br/>
                        ✅ Routing-Buttons integriert
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">🔍 Geocoding Service</h4>
                      <p className="text-sm text-green-800 mb-3">
                        Nutzen Sie das Suchfeld oben links auf der Karte
                      </p>
                      <div className="text-xs text-green-700">
                        ✅ Address Search aktiv<br/>
                        ✅ Auto-Completion verfügbar<br/>
                        ✅ Result Markers platziert
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-2">🧭 Routing Service</h4>
                      <p className="text-sm text-purple-800 mb-3">
                        Klicken Sie "Start" und "Ziel" in InfoBubbles
                      </p>
                      <div className="text-xs text-purple-700">
                        ✅ Route Calculation aktiv<br/>
                        ✅ Polyline Rendering<br/>
                        ✅ Waypoint Management
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-900 mb-2">🚦 Traffic Layer</h4>
                      <p className="text-sm text-orange-800 mb-3">
                        Live Traffic Incidents werden automatisch angezeigt
                      </p>
                      <div className="text-xs text-orange-700">
                        ✅ Traffic Incidents Layer<br/>
                        ✅ Real-time Updates<br/>
                        ✅ Visual Indicators
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-900 mb-2">📱 Responsive Design</h4>
                      <p className="text-sm text-red-800 mb-3">
                        Testen Sie verschiedene Bildschirmgrößen
                      </p>
                      <div className="text-xs text-red-700">
                        ✅ Mobile Optimiert<br/>
                        ✅ Touch Events<br/>
                        ✅ Auto-Resize
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">🌍 Language Support</h4>
                      <p className="text-sm text-gray-800 mb-3">
                        UI passt sich an i18n Spracheinstellung an
                      </p>
                      <div className="text-xs text-gray-700">
                        ✅ Multi-Language UI<br/>
                        ✅ Fallback Texte<br/>
                        ✅ Dynamic Updates
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls & Status */}
            <div className="space-y-6">
              
              {/* Map Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Map Einstellungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="mock-data" className="text-sm">Mock Daten anzeigen</Label>
                      <Switch
                        id="mock-data"
                        checked={mapSettings.showMockData}
                        onCheckedChange={(checked) => updateSetting('showMockData', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="test-markers" className="text-sm">Test Marker</Label>
                      <Switch
                        id="test-markers"
                        checked={mapSettings.showTestMarkers}
                        onCheckedChange={(checked) => updateSetting('showTestMarkers', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="transports" className="text-sm">Transport Angebote</Label>
                      <Switch
                        id="transports"
                        checked={mapSettings.showTransports}
                        onCheckedChange={(checked) => updateSetting('showTransports', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="requests" className="text-sm">Transport Anfragen</Label>
                      <Switch
                        id="requests"
                        checked={mapSettings.showRequests}
                        onCheckedChange={(checked) => updateSetting('showRequests', checked)}
                      />
                    </div>

                    <hr className="my-4" />

                    <div className="flex items-center justify-between">
                      <Label htmlFor="traffic" className="text-sm">Traffic Layer</Label>
                      <Switch
                        id="traffic"
                        checked={mapSettings.enableTraffic}
                        onCheckedChange={(checked) => updateSetting('enableTraffic', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="routing" className="text-sm">Routing Service</Label>
                      <Switch
                        id="routing"
                        checked={mapSettings.enableRouting}
                        onCheckedChange={(checked) => updateSetting('enableRouting', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="geocoding" className="text-sm">Geocoding Service</Label>
                      <Switch
                        id="geocoding"
                        checked={mapSettings.enableGeocoding}
                        onCheckedChange={(checked) => updateSetting('enableGeocoding', checked)}
                      />
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Feature Status */}
              <HereMapFeatureStatus featureStatus={featureStatus} />

            </div>
          </div>

          {/* Performance Notice */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎉 HERE Maps Integration erfolgreich abgeschlossen!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-green-800">✅ Modular Loading</div>
                    <div className="text-green-700">Core, Service, UI, Events</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">✅ Interactive Features</div>
                    <div className="text-blue-700">Drag, Zoom, Click, InfoBubbles</div>
                  </div>
                  <div>
                    <div className="font-medium text-purple-800">✅ Advanced Services</div>
                    <div className="text-purple-700">Traffic, Routing, Geocoding</div>
                  </div>
                  <div>
                    <div className="font-medium text-orange-800">✅ Production Ready</div>
                    <div className="text-orange-700">Error Handling, Fallbacks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
};

export default HereMapFeatureDemo;

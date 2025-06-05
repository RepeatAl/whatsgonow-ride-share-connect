
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { HereMapComponent } from '@/components/map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Smartphone, Monitor, Check } from 'lucide-react';

const HereMapDemo = () => {
  const [showTestMarkers, setShowTestMarkers] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 52.5, lng: 13.4 });

  const testLocations = [
    { name: 'Berlin', lat: 52.5, lng: 13.4 },
    { name: 'München', lat: 48.1, lng: 11.6 },
    { name: 'Hamburg', lat: 53.6, lng: 10.0 },
    { name: 'Köln', lat: 50.9, lng: 6.9 }
  ];

  const checklistItems = [
    { title: 'HERE Maps API Key', status: 'completed', desc: 'Sicher in Supabase Secrets hinterlegt' },
    { title: 'Basis-Kartenkomponente', status: 'completed', desc: 'HereMapComponent.tsx erstellt und funktionsfähig' },
    { title: 'Responsive Container', status: 'completed', desc: 'Desktop & Mobile optimiert' },
    { title: 'Test Marker', status: 'completed', desc: 'Hello World Pins als Funktionsnachweis' },
    { title: 'Error Handling', status: 'completed', desc: 'Fallbacks bei API/Netzwerk-Fehlern' },
    { title: 'Security Check', status: 'completed', desc: 'Kein API Key im Frontend-Code' }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HERE Maps Integration</h1>
            <p className="text-gray-600 mt-2">
              MVP-Basis Implementierung gemäß CTO-Checkliste
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Desktop Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Funktionsfähig
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Responsive
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  API Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  Sicher konfiguriert
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Demo Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Live Demo & Testing</CardTitle>
              <CardDescription>
                Testen Sie die Kartenkomponente mit verschiedenen Einstellungen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {testLocations.map((location) => (
                  <Button
                    key={location.name}
                    variant="outline"
                    size="sm"
                    onClick={() => setMapCenter({ lat: location.lat, lng: location.lng })}
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant={showTestMarkers ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowTestMarkers(!showTestMarkers)}
                >
                  Test Marker {showTestMarkers ? 'ausblenden' : 'anzeigen'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Map Component */}
          <Card>
            <CardHeader>
              <CardTitle>HERE Maps Komponente</CardTitle>
              <CardDescription>
                Vollständig responsive Karte mit Test-Markern und Interaktionen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HereMapComponent
                height="500px"
                center={mapCenter}
                zoom={10}
                showTestMarkers={showTestMarkers}
                className="border rounded-lg"
              />
            </CardContent>
          </Card>

          {/* CTO Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>CTO-Checkliste Status</CardTitle>
              <CardDescription>
                Alle MVP-Basis Anforderungen erfüllt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      Erledigt
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HereMapDemo;


import React from 'react';
import Layout from '@/components/Layout';
import HereMapFeatureDemo from '@/components/map/HereMapFeatureDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Map, Zap, Navigation, Search, Route, MapPin, Globe, Info } from 'lucide-react';

const HereMapFeaturesDemo = () => {
  const { t } = useTranslation(['common', 'landing']);

  const features = [
    {
      icon: <Route className="h-5 w-5" />,
      title: 'Routing Service',
      description: 'Start-Ziel-Routen berechnen und als Linie anzeigen',
      status: 'active'
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Traffic Layer',
      description: 'Live-Verkehrsinformationen und Staumeldungen',
      status: 'active'
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: 'Geocoding',
      description: 'Adressen zu Koordinaten und umgekehrt',
      status: 'active'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Interaktive Marker',
      description: 'Klickbare Marker mit InfoBubbles',
      status: 'active'
    },
    {
      icon: <Navigation className="h-5 w-5" />,
      title: 'Klick-Koordinaten',
      description: 'Position bei Kartenklick erfassen',
      status: 'active'
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Mehrsprachigkeit',
      description: 'Dynamische Sprachanpassung (DE/EN/AR)',
      status: 'active'
    }
  ];

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
              Vollständige Integration aller HERE Maps Services: Routing, Traffic, Geocoding, 
              Interaktive Marker, Sprachunterstützung und erweiterte Funktionen.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {feature.icon}
                    </div>
                    {feature.title}
                    <Badge variant="default" className="ml-auto">
                      {feature.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Demo */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-green-500" />
                Interaktive HERE Maps Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <HereMapFeatureDemo height="700px" className="rounded-lg overflow-hidden" />
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Anleitung zur Nutzung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-900">🎯 Marker Interaktion</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Klicken Sie auf blaue Marker für InfoBubbles</li>
                    <li>• Verwenden Sie "Start" und "Ziel" Buttons</li>
                    <li>• InfoBubbles zeigen Details und Aktionen</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-green-900">🔍 Geocoding</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Suchen Sie Adressen im oberen Suchfeld</li>
                    <li>• Grüne Marker zeigen Suchergebnisse</li>
                    <li>• Automatisches Zoomen zu Ergebnissen</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-purple-900">🧭 Routing</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Setzen Sie Start und Ziel über Marker</li>
                    <li>• Blaue Linie zeigt berechnete Route</li>
                    <li>• Route zurücksetzen über Button</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-orange-900">📍 Koordinaten</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Klicken Sie auf die Karte für Koordinaten</li>
                    <li>• Gelbe Marker zeigen Klickposition</li>
                    <li>• Koordinaten werden rechts angezeigt</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
};

export default HereMapFeaturesDemo;

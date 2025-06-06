
import React from 'react';
import Layout from '@/components/Layout';
import HereMapWithData from '@/components/map/HereMapWithData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Map, Zap, Info, TrendingUp } from 'lucide-react';

const HereMapDemo = () => {
  const { t } = useTranslation(['common', 'landing']);
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Map className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Live Transport Map
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('landing:map_subtitle')} - Alle verfügbaren Fahrten und Transportanfragen in Echtzeit
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Map className="h-5 w-5 text-blue-600" />
                  Live Daten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Echte Transportanfragen und Fahrten von verifizierten Nutzern
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-green-600" />
                  DSGVO-konform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Nur öffentliche Informationen ohne personenbezogene Daten
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Interaktiv
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Klicken Sie auf Marker für Details und Kontaktmöglichkeiten
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Map */}
          <Card className="shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-green-500" />
                Live Transport Map Deutschland
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <HereMapWithData 
                height="600px" 
                className="rounded-lg overflow-hidden" 
                center={{ lat: 51.1657, lng: 10.4515 }}
                zoom={6}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={getLocalizedUrl('/here-maps-features')}>
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Zap className="mr-2 h-5 w-5" />
                  Alle Features testen
                </Button>
              </Link>
              
              <Link to={getLocalizedUrl('/register')}>
                <Button size="lg" className="text-lg px-8 py-3">
                  <Map className="mr-2 h-5 w-5" />
                  Eigenen Transport einstellen
                </Button>
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                So funktioniert die Live Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-900">🚗 Fahrten (grüne Marker)</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Verfügbare Fahrzeuge mit freier Kapazität</li>
                    <li>• Preis pro Kilogramm oder Pauschalpreis</li>
                    <li>• Start- und Zieladresse sichtbar</li>
                    <li>• Abfahrtszeit und Fahrzeugtyp</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-blue-900">📦 Transportaufträge (blaue Marker)</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Artikel die transportiert werden müssen</li>
                    <li>• Gewicht, Maße und Kategorie</li>
                    <li>• Abholort und Zieladresse</li>
                    <li>• Deadline und angebotener Preis</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🔒 Datenschutz & Privatsphäre</h4>
                <p className="text-sm text-blue-800">
                  Alle angezeigten Informationen sind öffentlich und enthalten keine personenbezogenen Daten. 
                  Kontaktdaten und weitere Details werden erst nach Registrierung und bei berechtigtem Interesse freigegeben.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
};

export default HereMapDemo;

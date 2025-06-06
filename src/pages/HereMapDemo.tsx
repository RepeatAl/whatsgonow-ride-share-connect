
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { HereMapComponent } from '@/components/map';
import HereMapDiagnostics from '@/components/map/HereMapDiagnostics';
import { AdminTabGuard } from '@/components/auth/AdminTabGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Smartphone, Monitor, Check, Filter, Truck, Package, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { isAdmin } from '@/lib/admin-utils';

const HereMapDemo = () => {
  const { t } = useTranslation(['common']);
  const { currentLanguage } = useLanguageMCP();
  const { profile } = useSimpleAuth();
  const [showTransports, setShowTransports] = useState(true);
  const [showRequests, setShowRequests] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 51.1657, lng: 10.4515 }); // Center of Germany

  // Check if user has admin privileges for conditional tab rendering
  const userIsAdmin = isAdmin(profile);

  const testLocations = [
    { name: 'Deutschland', lat: 51.1657, lng: 10.4515 },
    { name: 'Berlin', lat: 52.5, lng: 13.4 },
    { name: 'München', lat: 48.1, lng: 11.6 },
    { name: 'Hamburg', lat: 53.6, lng: 10.0 },
    { name: 'Köln', lat: 50.9, lng: 6.9 }
  ];

  const checklistItems = [
    { 
      title: t('common:api_key_secure', 'HERE Maps API Key'), 
      status: 'completed', 
      desc: t('common:api_key_desc', 'Sicher in Supabase Secrets hinterlegt') 
    },
    { 
      title: t('common:map_component', 'Basis-Kartenkomponente'), 
      status: 'completed', 
      desc: t('common:map_component_desc', 'HereMapComponent.tsx erstellt und funktionsfähig') 
    },
    { 
      title: t('common:responsive_container', 'Responsive Container'), 
      status: 'completed', 
      desc: t('common:responsive_desc', 'Desktop & Mobile optimiert') 
    },
    { 
      title: t('common:mock_data', 'Mock-Daten Integration'), 
      status: 'completed', 
      desc: t('common:mock_data_desc', 'Deutsche Städte mit Demo-Transporten und Anfragen') 
    },
    { 
      title: t('common:error_handling', 'Error Handling'), 
      status: 'completed', 
      desc: t('common:error_desc', 'Fallbacks bei API/Netzwerk-Fehlern') 
    },
    { 
      title: t('common:security_check', 'Security Check'), 
      status: 'completed', 
      desc: t('common:security_desc', 'Kein API Key im Frontend-Code') 
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('common:here_maps_integration', 'HERE Maps Integration')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('common:mvp_basis_implementation', 'MVP-Basis Implementierung mit öffentlicher Kartenansicht')}
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  {t('common:desktop_ready', 'Desktop Ready')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  {t('common:functional', 'Funktionsfähig')}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  {t('common:mobile_ready', 'Mobile Ready')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  {t('common:responsive', 'Responsive')}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('common:api_integration', 'API Integration')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  {t('common:public_ready', 'Öffentlich verfügbar')}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs - Conditionally render tabs based on user role */}
          <Tabs defaultValue="demo" className="space-y-6">
            <TabsList className={`grid w-full ${userIsAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="checklist">Feature Overview</TabsTrigger>
              {userIsAdmin && (
                <TabsTrigger value="diagnostics">Diagnose</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="demo" className="space-y-6">
              {/* Demo Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('common:live_demo_testing', 'Live Demo & Testing')}</CardTitle>
                  <CardDescription>
                    {t('common:test_map_component', 'Testen Sie die Kartenkomponente mit verschiedenen Einstellungen')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location Controls */}
                  <div>
                    <h4 className="font-medium mb-2">{t('common:test_locations', 'Test-Standorte')}</h4>
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
                  </div>
                  
                  {/* Filter Controls */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {t('common:data_filters', 'Daten-Filter')}
                    </h4>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={showTransports ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowTransports(!showTransports)}
                        className="flex items-center gap-2"
                      >
                        <Truck className="h-4 w-4" />
                        {t('common:transports', 'Fahrten')} {showTransports ? '✓' : ''}
                      </Button>
                      <Button
                        variant={showRequests ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowRequests(!showRequests)}
                        className="flex items-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        {t('common:requests', 'Anfragen')} {showRequests ? '✓' : ''}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Component */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('common:here_maps_component', 'HERE Maps Komponente')}</CardTitle>
                  <CardDescription>
                    {t('common:responsive_map_description', 'Vollständig responsive Karte mit Mock-Daten und Interaktionen')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HereMapComponent
                    height="600px"
                    center={mapCenter}
                    zoom={7}
                    showMockData={true}
                    showTestMarkers={false}
                    showTransports={showTransports}
                    showRequests={showRequests}
                    className="border rounded-lg"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Secured Diagnostics Tab - Only for Admins */}
            {userIsAdmin && (
              <TabsContent value="diagnostics">
                <AdminTabGuard
                  fallbackTitle={t('common:access_denied.admin_title', 'Administrator-Zugriff erforderlich')}
                  fallbackDescription={t('common:access_denied.diagnostics_desc', 'Die Diagnose-Funktionen sind nur für Systemadministratoren zugänglich.')}
                >
                  <HereMapDiagnostics />
                </AdminTabGuard>
              </TabsContent>
            )}

            <TabsContent value="checklist" className="space-y-6">
              {/* Feature Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('common:feature_overview', 'Feature-Übersicht')}</CardTitle>
                  <CardDescription>
                    {t('common:mvp_requirements_fulfilled', 'Alle öffentlichen Funktionen sind verfügbar')}
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
                          {t('common:completed', 'Erledigt')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Legend Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('common:map_legend', 'Karten-Legende')}</CardTitle>
                  <CardDescription>
                    {t('common:color_coding_explanation', 'Farbkodierung der Marker nach Preiskategorien')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-green-500"></div>
                      <div>
                        <div className="font-medium text-green-800">{t('common:budget_friendly', 'Günstig')}</div>
                        <div className="text-sm text-green-600">&lt; 15€</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-orange-500"></div>
                      <div>
                        <div className="font-medium text-orange-800">{t('common:medium_price', 'Mittel')}</div>
                        <div className="text-sm text-orange-600">15€ - 25€</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-red-500"></div>
                      <div>
                        <div className="font-medium text-red-800">{t('common:premium', 'Premium')}</div>
                        <div className="text-sm text-red-600">&gt; 25€</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default HereMapDemo;

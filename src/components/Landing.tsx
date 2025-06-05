
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Truck, Users, MapPin, Star, ChevronRight, Play, Map } from 'lucide-react';
import HowItWorks from '@/components/HowItWorks';
import { HereMapComponent } from '@/components/map';

const Landing = () => {
  const { t } = useTranslation(['common', 'landing']);
  const { getLocalizedUrl, currentLanguage } = useLanguageMCP();

  console.log('[Landing] Current language:', currentLanguage);
  console.log('[Landing] Login URL:', getLocalizedUrl('/login'));
  console.log('[Landing] Register URL:', getLocalizedUrl('/register'));

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: t('landing:feature_transport_title', 'Schneller Transport'),
      description: t('landing:feature_transport_desc', 'Finden Sie sofort verfügbare Fahrer in Ihrer Region für Ihren Transport.')
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t('landing:feature_community_title', 'Community'),
      description: t('landing:feature_community_desc', 'Werden Sie Teil einer vertrauensvollen Gemeinschaft von Fahrern und Auftraggebern.')
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: t('landing:feature_local_title', 'Regional'),
      description: t('landing:feature_local_desc', 'Unterstützen Sie lokale Fahrer und reduzieren Sie CO2-Emissionen.')
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: t('landing:feature_trust_title', 'Vertrauen'),
      description: t('landing:feature_trust_desc', 'Bewertungssystem und verifizierte Profile für maximale Sicherheit.')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('landing:hero_title', 'Crowdlogistik neu gedacht')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('landing:hero_subtitle', 'Verbinden Sie sich mit verifizierten Fahrern in Ihrer Region. Einfach, sicher und nachhaltig.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={getLocalizedUrl('/register')}>
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                {t('landing:cta_register', 'Jetzt registrieren')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to={getLocalizedUrl('/login')}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                {t('landing:cta_login', 'Anmelden')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <HowItWorks />
        </div>
      </section>

      {/* Live Map Section - NEW */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('landing:map_title', 'Live Transporte in Ihrer Region')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('landing:map_subtitle', 'Entdecken Sie verfügbare Fahrten und Transportanfragen in ganz Deutschland')}
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-0">
              <HereMapComponent
                height="350px"
                showMockData={true}
                showTestMarkers={false}
                showTransports={true}
                showRequests={true}
                zoom={6}
                center={{ lat: 51.1657, lng: 10.4515 }} // Center of Germany
                className="rounded-lg overflow-hidden"
              />
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Link to={getLocalizedUrl('/here-maps-demo')}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Map className="mr-2 h-5 w-5" />
                {t('landing:map_cta', 'Interaktive Karte erkunden')}
              </Button>
            </Link>
          </div>
          
          {/* Map Legend */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-6 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Günstig (&lt; 15€)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Mittel (15-25€)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Premium (&gt; 25€)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t('landing:features_title', 'Warum Whatsgonow?')}
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {t('landing:features_subtitle', 'Entdecken Sie die Vorteile unserer innovativen Crowdlogistik-Plattform')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('landing:cta_section_title', 'Starten Sie noch heute')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('landing:cta_section_subtitle', 'Werden Sie Teil der Whatsgonow Community und erleben Sie Crowdlogistik der nächsten Generation.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={getLocalizedUrl('/register')}>
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                {t('landing:cta_register', 'Jetzt registrieren')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to={getLocalizedUrl('/pre-register')}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-3">
                {t('landing:cta_preregister', 'Auf Warteliste')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

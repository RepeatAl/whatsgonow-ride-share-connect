
import React from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import ESGSection from "@/components/home/ESGSection";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import HowItWorks from "@/components/HowItWorks";
import { HereMapComponent } from "@/components/map";
import { useTranslation } from 'react-i18next';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Map } from 'lucide-react';

/**
 * SYNCHRONIZED Landing Page - This file should match components/Landing.tsx exactly
 * This prevents routing conflicts and ensures consistent behavior
 */
const Landing = () => {
  const { t } = useTranslation(['common', 'landing']);
  const { getLocalizedUrl } = useLanguageMCP();

  console.log('[Landing] Rendering Landing page with HERE Maps');

  return (
    <Layout hideNavigation={true} pageType="home">
      <div className="min-h-screen">
        <Hero />
        <HowItWorks />
        
        {/* HERE Maps Integration Section */}
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

        <Benefits />
        <UserGroups />
        <ESGSection />
        <Testimonials />
        <CTA />
      </div>
    </Layout>
  );
};

export default Landing;

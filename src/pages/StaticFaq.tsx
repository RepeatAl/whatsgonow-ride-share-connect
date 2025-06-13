
// TEMPORÄR: Standalone FAQ-Page ohne globale Context-Abhängigkeiten
// Diese Seite wird nach Context-Isolation durch DynamicFaq.tsx ersetzt

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { StaticFaqComponent } from '@/components/content/StaticFaqComponent';

const StaticFaq: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - Whatsgonow</title>
        <meta name="description" content="Häufig gestellte Fragen zu whatsgonow - der Crowdlogistik-Plattform" />
      </Helmet>
      
      {/* KRITISCH: Keine Layout/Provider-Wrapper - komplett standalone */}
      <div className="min-h-screen bg-background">
        <StaticFaqComponent />
      </div>
    </>
  );
};

export default StaticFaq;

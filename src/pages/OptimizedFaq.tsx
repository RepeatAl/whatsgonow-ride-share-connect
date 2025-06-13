
// FINAL VERSION: Optimierte standalone FAQ-Page - 100% isoliert, production-ready
// NO-GLOBALS-REGEL: Komplett standalone ohne globale Context-Abhängigkeiten

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { OptimizedFaqComponent } from '@/components/content/OptimizedFaqComponent';

const OptimizedFaq: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - Whatsgonow</title>
        <meta name="description" content="Häufig gestellte Fragen zu whatsgonow - der Crowdlogistik-Plattform" />
        <meta name="keywords" content="FAQ, whatsgonow, crowdlogistik, transport, fragen, hilfe" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://whatsgonow.com/faq" />
      </Helmet>
      
      {/* KRITISCH: Keine Layout/Provider-Wrapper - komplett standalone */}
      <div className="min-h-screen bg-background">
        <OptimizedFaqComponent />
      </div>
    </>
  );
};

export default OptimizedFaq;

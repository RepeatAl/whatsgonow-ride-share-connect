
import React from "react";
import { useTranslation } from "react-i18next";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import Layout from "@/components/Layout";

// Import all landing sections
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import LiveMapSection from "@/components/home/LiveMapSection";
import Testimonials from "@/components/home/Testimonials";
import ESGSection from "@/components/home/ESGSection";
import UserGroups from "@/components/home/UserGroups";
import CTA from "@/components/home/CTA";

const Landing = () => {
  const { t, ready } = useTranslation(['landing', 'common']);
  const { user } = useOptimizedAuth();

  if (!ready) {
    return (
      <Layout pageType="public">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-orange"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={t("landing:page_title", "Whatsgonow - Deine Crowdlogistik-Plattform")}
      description={t("landing:page_description", "Verbinde dich mit verifizierten Fahrern für schnelle und zuverlässige Transporte in deiner Nähe.")}
      pageType="public"
    >
      {/* Complete Landing Page with all sections */}
      <div className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        
        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Benefits Section */}
        <Benefits />
        
        {/* Live Map Section */}
        <LiveMapSection />
        
        {/* User Groups Section */}
        <UserGroups />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* ESG Section */}
        <ESGSection />
        
        {/* Call to Action Section */}
        <CTA />
      </div>
    </Layout>
  );
};

export default Landing;

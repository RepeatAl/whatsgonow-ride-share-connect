
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import TranslationLoader from "@/components/i18n/TranslationLoader";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Landing = () => {
  const { ensureNamespaceLoaded } = useLanguageMCP();
  
  // Ensure the landing namespace is loaded
  useEffect(() => {
    ensureNamespaceLoaded(['landing', 'common']);
  }, [ensureNamespaceLoaded]);
  
  return (
    <TranslationLoader namespaces={['landing', 'common']}>
      <Layout>
        {/* Hero Section */}
        <Hero />
        
        {/* How It Works Section */}
        <HowItWorks />
        
        {/* Benefits Section */}
        <Benefits />
        
        {/* User Groups Section */}
        <UserGroups />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* Call to Action Section */}
        <CTA />
      </Layout>
    </TranslationLoader>
  );
};

export default Landing;

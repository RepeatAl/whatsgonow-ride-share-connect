
import React from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import ESGSection from "@/components/home/ESGSection";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

const Home = () => {
  const { t, i18n } = useTranslation(['landing', 'common']);
  const isRTL = i18n.language === 'ar';

  return (
    <Layout 
      pageType="landing" 
      hideNavigation={true}
      hideFooter={false}
      minimal={false}
    >
      <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
        <Hero />
        <HowItWorks />
        <Benefits />
        <UserGroups />
        <ESGSection />
        <Testimonials />
        <CTA />
      </div>
    </Layout>
  );
};

export default Home;


import React from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import ESGSection from "@/components/home/ESGSection";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

const Landing = () => {
  return (
    <Layout hideNavigation={true} pageType="home">
      <div className="min-h-screen">
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

export default Landing;

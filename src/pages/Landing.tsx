
import React from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

const Landing = () => {
  return (
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
  );
};

export default Landing;


import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useLaunch } from "@/components/launch/LaunchProvider";

const Index = () => {
  const { isLaunchReady, isTestRegion } = useLaunch();
  
  // Only show feedback button if launched or in test region
  const showFeedbackButton = isLaunchReady || isTestRegion;
  
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <Benefits />
      <UserGroups />
      <Testimonials />
      <CTA />
      
      {showFeedbackButton && (
        <div className="fixed bottom-6 right-6 z-10">
          <Button asChild className="rounded-full h-14 w-14 p-0">
            <Link to="/feedback">
              <MessageSquare className="h-6 w-6" />
              <span className="sr-only">Share Feedback</span>
            </Link>
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default Index;

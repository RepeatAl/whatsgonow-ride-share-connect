
import React from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, LogIn, LayoutDashboard, MessageCircle } from "lucide-react";
import { useLaunch } from "@/components/launch/LaunchProvider";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isLaunchReady, isTest } = useLaunch();
  const { user } = useAuth();
  
  const showFeedbackButton = isLaunchReady || isTest;
  
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <Benefits />
      <UserGroups />
      <Testimonials />
      <CTA />
      
      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-3">
        {user ? (
          <Button asChild className="rounded-full h-14 w-14 p-0" variant="accent">
            <Link to="/dashboard">
              <LayoutDashboard className="h-6 w-6" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </Button>
        ) : (
          <Button asChild className="rounded-full h-14 w-14 p-0" variant="accent">
            <Link to="/login">
              <LogIn className="h-6 w-6" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        )}
        
        <Button asChild className="rounded-full h-14 w-14 p-0" variant="outline">
          <Link to="/inbox">
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Start Chat</span>
          </Link>
        </Button>
        
        {showFeedbackButton && (
          <Button asChild className="rounded-full h-14 w-14 p-0">
            <Link to="/feedback">
              <MessageSquare className="h-6 w-6" />
              <span className="sr-only">Share Feedback</span>
            </Link>
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default Index;

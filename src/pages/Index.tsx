import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Benefits from "@/components/home/Benefits";
import UserGroups from "@/components/home/UserGroups";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, LogIn, LayoutDashboard } from "lucide-react";
import { useLaunch } from "@/components/launch/LaunchProvider";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Index = () => {
  const { isLaunchReady, isTest } = useLaunch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Only show feedback button if launched or in test region
  const showFeedbackButton = isLaunchReady || isTest;
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <Benefits />
      <UserGroups />
      <Testimonials />
      <CTA />
      
      <div className="fixed bottom-6 right-6 z-10 flex flex-col gap-3">
        {isLoggedIn ? (
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

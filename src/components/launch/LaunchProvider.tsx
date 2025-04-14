
import { useEffect, useState, ReactNode, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import NewUserOnboarding from "./NewUserOnboarding";

// Utility function to check if a region is a test region
const isTestRegion = (region: string | null | undefined) => {
  const TEST_REGION_PREFIXES = ["test", "us-ca", "us-ny", "uk-ldn"];
  return region ? TEST_REGION_PREFIXES.some(prefix => 
    region.toLowerCase().startsWith(prefix)
  ) : false;
};

interface LaunchContextType {
  region: string | null;
  isTest: boolean;
  isLaunchReady: boolean;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

const LaunchContext = createContext<LaunchContextType | undefined>(undefined);

export const useLaunch = () => {
  const context = useContext(LaunchContext);
  if (!context) {
    throw new Error("useLaunch must be used within a LaunchProvider");
  }
  return context;
};

interface LaunchProviderProps {
  children: ReactNode;
}

const LaunchProvider = ({ children }: LaunchProviderProps) => {
  const [region, setRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if launch is ready from environment variable
  const isLaunchReady = import.meta.env.VITE_LAUNCH_READY === "true";
  const isTest = isTestRegion(region);

  // Analytics tracking function
  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    console.log(`[Analytics] ${eventName}`, properties);

    if (eventName === "page_view") {
      console.log(`User visited: ${properties.path}`);
    }
  };

  useEffect(() => {
    const fetchUserRegion = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("region")
        .eq("user_id", user.id)
        .single();

      if (error || !profile) {
        console.error("Failed to load region", error);
        setRegion(null);
      } else {
        setRegion(profile.region);
      }

      setLoading(false);
    };

    fetchUserRegion();
  }, [navigate]);

  // Onboarding logic
  useEffect(() => {
    const isNewUser = localStorage.getItem("hasSeenOnboarding") !== "true";
    
    if (isNewUser && location.pathname === "/" && (isLaunchReady || isTest)) {
      setShowOnboarding(true);
    }
  }, [isLaunchReady, isTest, location]);

  // Track page views
  useEffect(() => {
    trackEvent("page_view", { path: location.pathname });
  }, [location.pathname]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  if (loading) {
    return <div className="p-4">Lade Region...</div>;
  }

  return (
    <LaunchContext.Provider
      value={{ 
        region, 
        isTest, 
        isLaunchReady,
        trackEvent,
        hasCompletedOnboarding,
        setHasCompletedOnboarding 
      }}
    >
      {showOnboarding && <NewUserOnboarding onComplete={handleOnboardingComplete} />}
      {children}
    </LaunchContext.Provider>
  );
};

export default LaunchProvider;

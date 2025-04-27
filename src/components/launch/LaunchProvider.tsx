
import { useEffect, useState, ReactNode, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import NewUserOnboarding from "./NewUserOnboarding";
import { isTestRegion, fetchUserRegion } from "@/utils/regionUtils";

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
  const { user, isInitialLoad } = useAuth();

  const isLaunchReady = import.meta.env.VITE_LAUNCH_READY === "true";
  const isTest = isTestRegion(region);

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    console.log(`[Analytics] ${eventName}`, properties);

    if (eventName === "page_view") {
      console.log(`User visited: ${properties.path}`);
    }
  };

  useEffect(() => {
    const loadUserRegion = async () => {
      try {
        setLoading(true);
        
        if (isInitialLoad) {
          return;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setRegion("unbekannt");
          setLoading(false);
          return;
        }

        if (!sessionData.session?.user) {
          console.warn("No user logged in");
          setRegion("unbekannt");
          setLoading(false);
          return;
        }

        const userRegion = await fetchUserRegion(supabase, sessionData.session.user.id);
        if (!userRegion) {
          console.warn("No region found for user, redirecting to profile completion");
          navigate("/complete-profile");
        }
        
        setRegion(userRegion || "unbekannt");
        setLoading(false);
      } catch (error) {
        console.error("Error in loadUserRegion:", error);
        setRegion("unbekannt");
        setLoading(false);
      }
    };

    loadUserRegion();
  }, [navigate, location.pathname, isInitialLoad]);

  useEffect(() => {
    const isNewUser = localStorage.getItem("hasSeenOnboarding") !== "true";
    
    if (isNewUser && location.pathname === "/" && (isLaunchReady || isTest)) {
      setShowOnboarding(true);
    }
  }, [isLaunchReady, isTest, location]);

  useEffect(() => {
    trackEvent("page_view", { path: location.pathname });
  }, [location.pathname]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  if (isInitialLoad) {
    return <LoadingSpinner />;
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

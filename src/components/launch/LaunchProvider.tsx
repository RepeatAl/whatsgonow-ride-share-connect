
import { useEffect, useState, ReactNode, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
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
    const loadUserRegion = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError);
          setRegion("unbekannt");
          setLoading(false);
          return;
        }
        
        const user = sessionData.session?.user;

        if (!user) {
          console.warn("Kein Benutzer eingeloggt");
          setRegion("unbekannt");
          setLoading(false);
          
          // Only navigate to login if not already on login page to avoid redirect loops
          if (location.pathname !== "/login" && location.pathname !== "/register") {
            navigate("/login");
          }
          return;
        }

        try {
          const userRegion = await fetchUserRegion(supabase, user.id);
          if (!userRegion) {
            console.warn("Region konnte nicht geladen werden");
            setRegion("unbekannt");
          } else {
            setRegion(userRegion);
          }
        } catch (e) {
          console.error("Fehler beim Laden der Region:", e);
          setRegion("unbekannt");
        } finally {
          setLoading(false);
        }
      } catch (e) {
        console.error("Unerwarteter Fehler:", e);
        setRegion("unbekannt");
        setLoading(false);
      }
    };

    loadUserRegion();
  }, [navigate, location.pathname]);

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

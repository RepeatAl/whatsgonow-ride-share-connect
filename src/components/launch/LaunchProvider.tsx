
import { useState, ReactNode, createContext, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserSession } from "@/contexts/UserSessionContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import NewUserOnboarding from "./NewUserOnboarding";

interface LaunchContextType {
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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use UserSessionContext instead of AuthContext
  const { user, isInitialLoad, isTest, region } = useUserSession();

  const isLaunchReady = import.meta.env.VITE_LAUNCH_READY === "true";

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    console.log(`[Analytics] ${eventName}`, properties);

    if (eventName === "page_view") {
      console.log(`User visited: ${properties.path}`);
    }
  };

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

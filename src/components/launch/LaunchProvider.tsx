import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import NewUserOnboarding from "./NewUserOnboarding";
import { useLocation } from "react-router-dom";

interface LaunchContextType {
  isLaunchReady: boolean;
  isTestRegion: boolean;
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
}

const LaunchContext = createContext<LaunchContextType | undefined>(undefined);

interface LaunchProviderProps {
  children: ReactNode;
}

const LaunchProvider = ({ children }: LaunchProviderProps) => {
  const [isTestRegion, setIsTestRegion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const location = useLocation();

  const isLaunchReady = import.meta.env.VITE_LAUNCH_READY === "true";

  useEffect(() => {
    const checkRegion = async () => {
      const mockUserRegion = "US-CA";
      setIsTestRegion(TEST_REGIONS.includes(mockUserRegion));
    };
    
    checkRegion();
  }, []);

  useEffect(() => {
    const isNewUser = localStorage.getItem("hasSeenOnboarding") !== "true";
    
    if (isNewUser && location.pathname === "/" && (isLaunchReady || isTestRegion)) {
      setShowOnboarding(true);
    }
  }, [isLaunchReady, isTestRegion, location]);

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    console.log(`[Analytics] ${eventName}`, properties);

    if (eventName === "page_view") {
      console.log(`User visited: ${properties.path}`);
    }
  };

  useEffect(() => {
    trackEvent("page_view", { path: location.pathname });
  }, [location.pathname]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const value = {
    isLaunchReady,
    isTestRegion,
    trackEvent,
    hasCompletedOnboarding,
    setHasCompletedOnboarding,
  };

  return (
    <LaunchContext.Provider value={value}>
      {showOnboarding && <NewUserOnboarding onComplete={handleOnboardingComplete} />}
      {children}
    </LaunchContext.Provider>
  );
};

export const useLaunch = () => {
  const context = useContext(LaunchContext);
  if (context === undefined) {
    throw new Error("useLaunch must be used within a LaunchProvider");
  }
  return context;
};

export default LaunchProvider;

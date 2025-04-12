
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

const TEST_REGIONS = ["US-CA", "US-NY", "UK-LDN"]; // Test regions by code

interface LaunchProviderProps {
  children: ReactNode;
}

const LaunchProvider = ({ children }: LaunchProviderProps) => {
  const [isTestRegion, setIsTestRegion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const location = useLocation();

  // Check if launch is ready from environment variable
  const isLaunchReady = import.meta.env.VITE_LAUNCH_READY === "true";

  useEffect(() => {
    // Simulate checking user's region
    const checkRegion = async () => {
      // In a real app, this would be an API call to determine the user's region
      const mockUserRegion = "US-CA"; // Mock for testing
      setIsTestRegion(TEST_REGIONS.includes(mockUserRegion));
    };
    
    checkRegion();
  }, []);

  useEffect(() => {
    // Check if this is a new user session
    const isNewUser = localStorage.getItem("hasSeenOnboarding") !== "true";
    
    if (isNewUser && location.pathname === "/" && (isLaunchReady || isTestRegion)) {
      setShowOnboarding(true);
    }
  }, [isLaunchReady, isTestRegion, location]);

  // Analytics tracking function
  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    // In production, this would send to Supabase analytics or Mixpanel
    console.log(`[Analytics] ${eventName}`, properties);

    // Log page visits and important events
    if (eventName === "page_view") {
      console.log(`User visited: ${properties.path}`);
    }
  };

  // Track page views
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

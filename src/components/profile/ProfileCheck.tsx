
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileCheck({ children }: { children: React.ReactNode }) {
  const { profile, loading, isInitialLoad, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Prevent any redirects until loading is finished
    if (loading || isInitialLoad) return;

    // Unauthenticated users are handled by route protection, not here
    // Only redirect if profile is present (logged in) and incomplete, and not already on the completion page
    if (user && profile && !profile.profile_complete && location.pathname !== "/complete-profile") {
      navigate("/complete-profile", { state: { from: location.pathname }, replace: true });
    }
    // Never redirect if not logged in or loading.
  }, [profile, loading, isInitialLoad, user, navigate, location.pathname]);

  if (loading || isInitialLoad) return null; // Prevent flashes & double rendering

  return <>{children}</>;
}

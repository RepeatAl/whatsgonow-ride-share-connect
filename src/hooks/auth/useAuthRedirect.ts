
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import type { UserProfile } from "@/types/auth";

export function useAuthRedirect(
  user: User | null,
  profile: UserProfile | null,
  loading: boolean,
  isInitialLoad: boolean = false
) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      console.log("⏳ Auth state loading, skipping redirect check");
      return;
    }

    const currentPath = location.pathname;
    
    // Wenn die aktuelle Route öffentlich ist, keine Weiterleitung
    if (isPublicRoute(currentPath)) {
      console.log("🌐 Public route access granted:", currentPath);
      return;
    }

    // Wenn kein User und keine öffentliche Route, zum Login
    if (!user) {
      console.log("🔒 Protected route access denied, redirecting to login");
      navigate("/login", { 
        state: { from: location }, 
        replace: true 
      });
      return;
    }

    // Wenn User eingeloggt ist und auf Login/Register-Seite, zur Startseite
    if (["/login", "/register"].includes(currentPath)) {
      console.log("✅ Auth page redirect to home");
      navigate("/", { replace: true });
      return;
    }
  }, [user, profile, loading, location, navigate, isInitialLoad]);
}

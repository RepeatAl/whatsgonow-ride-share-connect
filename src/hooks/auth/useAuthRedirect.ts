
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
    
    // Public routes are always accessible
    if (isPublicRoute(currentPath)) {
      console.log("🌐 Public route access granted:", currentPath);
      return;
    }

    // Non-authenticated users go to pre-register
    if (!user) {
      console.log("🔒 Protected route access denied, redirecting to pre-register");
      navigate("/pre-register", { 
        state: { from: location }, 
        replace: true 
      });
      return;
    }

    // Authenticated users on auth pages go to home
    if (["/login", "/register"].includes(currentPath)) {
      console.log("✅ Auth page redirect to home");
      navigate("/", { replace: true });
      return;
    }
  }, [user, profile, loading, location, navigate, isInitialLoad]);
}

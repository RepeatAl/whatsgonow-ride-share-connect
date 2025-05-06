
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import type { UserProfile } from "@/types/auth";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";

export function useAuthRedirect(
  user: User | null,
  profile: UserProfile | null,
  loading: boolean
) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      console.log("⏳ Auth loading – skip redirect");
      return;
    }

    const currentPath = location.pathname;
    const isAuthPage = ["/login", "/register", "/pre-register", "/pre-register/success", "/forgot-password", "/reset-password"].includes(currentPath);
    
    try {
      // Handle authentication state changes and redirects
      if (user && isAuthPage) {
        // User is authenticated but on an auth page - redirect to appropriate dashboard
        console.log("✅ Authentifizierter Nutzer auf Auth-Seite → Dashboard");
        const redirectPath = profile ? getRoleBasedRedirectPath(profile.role) : "/dashboard";
        
        // Check if profile is incomplete
        if (profile && !profile.profile_complete) {
          console.log("⚠️ Profil unvollständig → /complete-profile");
          navigate("/complete-profile", { replace: true });
          return;
        }
        
        navigate(redirectPath, { replace: true });
        return;
      }

      // If user is not authenticated and trying to access a protected route
      if (!user && !isPublicRoute(currentPath) && !isAuthPage) {
        console.log("🔒 Nicht authentifiziert → /login");
        navigate("/login", {
          state: { from: currentPath },
          replace: true
        });
        return;
      }
    } catch (error) {
      console.error("Navigation error in auth redirect:", error);
      // If navigation fails, safely redirect to home
      if (currentPath !== "/") {
        navigate("/", { replace: true });
      }
    }
  }, [user, profile, loading, location.pathname, navigate]);
}

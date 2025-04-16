
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";
import type { UserProfile } from "@/types/auth";

export function useAuthRedirect(
  user: User | null, 
  profile: UserProfile | null,
  loading: boolean
) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) return;

    const currentPath = location.pathname;
    console.log("📍 Auth redirect check at path:", currentPath);
    
    // Für Index/Root-Pfad keine automatische Weiterleitung, damit der Nutzer die Landingpage sieht
    if ((currentPath === "/" || currentPath === "/index") && user) {
      // Nur wenn der Nutzer auf / oder /index und eingeloggt ist, weiterleiten zum Dashboard
      const redirectPath = profile ? getRoleBasedRedirectPath(profile.role) : "/dashboard";
      console.log("🔀 Root path with logged in user, redirecting to:", redirectPath);
      navigate(redirectPath);
      return;
    }
    
    // Handle auth pages (don't redirect if already there)
    const isAuthPage = currentPath === "/login" || currentPath === "/register";
    
    if (user) {
      // User is authenticated
      if (isAuthPage) {
        // If on login/register page while authenticated, redirect to appropriate page
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        const redirectPath = profile ? getRoleBasedRedirectPath(profile.role) : from;
        console.log("🔀 Auth page with authenticated user, redirecting to:", redirectPath);
        navigate(redirectPath, { replace: true });
      }
    } else {
      // User is not authenticated
      if (!isPublicRoute(currentPath) && !isAuthPage) {
        // If on protected route and not authenticated, redirect to login
        console.log("🔒 Protected route without auth, redirecting to login");
        navigate("/login", { state: { from: location } });
      }
    }
  }, [user, profile, loading, location, navigate]);
}

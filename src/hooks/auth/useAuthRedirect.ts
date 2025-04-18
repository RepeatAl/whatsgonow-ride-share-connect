
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
    const isAuthPage = ["/login", "/register"].includes(currentPath);
    
    // When we have a logged-in user
    if (user) {
      // If user is on auth page but already authenticated, redirect to home
      if (isAuthPage) {
        console.log("✅ Auth page redirect: /");
        navigate("/", { replace: true });
        return;
      }
    } 
    // When user is not logged in
    else {
      // Only redirect if on a protected route and not already on an auth page
      if (!isPublicRoute(currentPath) && !isAuthPage) {
        console.log("🔒 Protected route access denied → /login");
        navigate("/login", { 
          state: { from: location }, 
          replace: true 
        });
        return;
      }
    }
  }, [user, profile, loading, location, navigate, isInitialLoad]);
}

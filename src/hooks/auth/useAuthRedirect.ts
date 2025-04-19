
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
    const currentPath = location.pathname;

    // Skip redirect logic while loading or on initial load
    if (loading || isInitialLoad) {
      console.log("⏳ Auth loading or initial load – skip redirect");
      return;
    }

    // 1) No auth needed for public routes
    if (isPublicRoute(currentPath)) {
      console.log("🌐 Public route → allow:", currentPath);
      return;
    }

    // 2) Not logged in - redirect to pre-register
    if (!user) {
      console.log("🔒 Not authenticated → /pre-register");
      navigate("/pre-register", {
        state: { from: currentPath },
        replace: true
      });
      return;
    }

    // 3) Logged-in users shouldn't access auth pages
    const isAuthPage = ["/login", "/register"].includes(currentPath);
    if (isAuthPage) {
      console.log("✅ Logged in on auth page → /");
      navigate("/", { replace: true });
      return;
    }
  }, [user, loading, isInitialLoad, location, navigate]);
}

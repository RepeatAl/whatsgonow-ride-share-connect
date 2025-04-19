
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import type { UserProfile } from "@/types/auth";

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

    // Public routes are always accessible
    if (isPublicRoute(currentPath)) {
      console.log("🌐 Public route → allow:", currentPath);
      return;
    }

    // Not logged in - redirect to pre-register
    if (!user) {
      console.log("🔒 Not authenticated → /pre-register");
      navigate("/pre-register", {
        state: { from: currentPath },
        replace: true
      });
      return;
    }

    // Logged-in users shouldn't access auth pages
    const isAuthPage = ["/login", "/register", "/pre-register"].includes(currentPath);
    if (isAuthPage) {
      console.log("✅ Logged in on auth page → /");
      navigate("/", { replace: true });
      return;
    }
  }, [user, loading, location, navigate]);
}


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

    // 1) Public route check - BEFORE everything else
    if (isPublicRoute(currentPath)) {
      console.log("🌐 Public route → allow:", currentPath);
      return;
    }

    // 2) While auth state is loading, do nothing
    if (loading) {
      console.log("⏳ Auth loading – skip redirect");
      return;
    }

    // 3) No user → waiting list
    if (!user) {
      console.log("🔒 Not authenticated → /pre-register");
      navigate("/pre-register", {
        state: { from: currentPath },
        replace: true
      });
      return;
    }

    // 4) Logged-in users on auth pages → landing page
    if (["/login", "/register"].includes(currentPath)) {
      console.log("✅ Logged in on auth page → /");
      navigate("/", { replace: true });
      return;
    }

    // 5) All other protected routes → stay
  }, [user, loading, location, navigate]);
}

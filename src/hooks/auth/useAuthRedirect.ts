
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
    const isAuthPage = ["/login", "/register", "/pre-register"].includes(currentPath);

    // Wenn der Nutzer eingeloggt ist und sich auf einer Auth-Seite befindet
    if (user && isAuthPage) {
      console.log("✅ Authentifizierter Nutzer auf Auth-Seite → Dashboard");
      const redirectPath = profile ? getRoleBasedRedirectPath(profile.role) : "/dashboard";
      navigate(redirectPath, { replace: true });
      return;
    }

    // Wenn der Nutzer nicht eingeloggt ist und eine geschützte Route aufruft
    if (!user && !isPublicRoute(currentPath) && !isAuthPage) {
      console.log("🔒 Nicht authentifiziert → /login");
      navigate("/login", {
        state: { from: currentPath },
        replace: true
      });
      return;
    }
  }, [user, profile, loading, location.pathname, navigate]);
}

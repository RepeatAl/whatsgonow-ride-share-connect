
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";
import { isProfileIncomplete } from "@/utils/profile-check";
import type { UserProfile } from "@/types/auth";

export function useAuthRedirect(
  user: User | null,
  profile: UserProfile | null,
  loading: boolean
) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;
    const isAuthPage = ["/login", "/register"].includes(currentPath);
    const isRootPage = ["/", "/index"].includes(currentPath);
    const isProfilePage = currentPath === "/profile";

    console.log("📍 useAuthRedirect check:", {
      path: currentPath,
      user: !!user,
      profileLoaded: !!profile
    });

    if (user) {
      // Profilprüfung - Leite zur Profilseite weiter, wenn unvollständig
      if (profile && !isProfilePage && isProfileIncomplete(profile)) {
        console.log("⚠️ Unvollständiges Profil, Weiterleitung zu /profile");
        navigate("/profile", { replace: true });
        return;
      }

      if (isRootPage) {
        const redirectTo = profile
          ? getRoleBasedRedirectPath(profile.role)
          : "/dashboard";
        console.log("✅ Eingeloggt auf Root, weiterleiten zu:", redirectTo);
        navigate(redirectTo, { replace: true });
        return;
      }

      if (isAuthPage) {
        const redirectTo =
          (location.state as any)?.from?.pathname ||
          (profile ? getRoleBasedRedirectPath(profile.role) : "/dashboard");
        console.log("✅ Eingeloggt auf Login/Register, redirect to:", redirectTo);
        navigate(redirectTo, { replace: true });
        return;
      }

      // Kein Redirect, wenn bereits korrekt eingeloggt
    } else {
      if (!isPublicRoute(currentPath) && !isAuthPage) {
        console.log("🔒 Nicht eingeloggt auf geschützter Route → Weiterleitung zu /login");
        navigate("/login", { state: { from: location }, replace: true });
        return;
      }
    }
  }, [user, profile, loading, location.pathname, navigate]);
}

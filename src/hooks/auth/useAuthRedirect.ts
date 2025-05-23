
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import type { UserProfile } from "@/types/auth";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";

/**
 * Hook zur zentralen Verwaltung aller Authentifizierungs-Weiterleitungen
 * Dies verhindert redundante Redirects und reduziert Flackern nach dem Login
 */
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
      // Falls der Nutzer eingeloggt ist und sich auf einer Auth-Seite befindet
      if (user && isAuthPage) {
        // Redirect zur rollenbasierten Seite mit einer einzigen Weiterleitung
        console.log("✅ Authentifizierter Nutzer auf Auth-Seite → Rollenbasiertes Dashboard");
        const redirectPath = profile ? getRoleBasedRedirectPath(profile.role) : "/dashboard";
        
        // Prüfe ob das Profil unvollständig ist
        if (profile && !profile.profile_complete) {
          console.log("⚠️ Profil unvollständig → /complete-profile");
          navigate("/complete-profile", { replace: true });
          return;
        }
        
        // Direkte Weiterleitung zum richtigen Dashboard ohne Umwege
        navigate(redirectPath, { replace: true });
        return;
      }

      // Wenn nicht authentifiziert und auf geschützter Route
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
      // Bei Navigation-Fehlern sicher zur Startseite weiterleiten
      if (currentPath !== "/") {
        navigate("/", { replace: true });
      }
    }
  }, [user, profile, loading, location.pathname, navigate]);
}

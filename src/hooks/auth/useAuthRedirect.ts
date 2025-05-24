
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { isPublicRoute } from "@/routes/publicRoutes";
import type { UserProfile } from "@/types/auth";
import { getRoleBasedRedirectPath } from "@/utils/auth-utils";
import { extractLanguageFromUrl, addLanguageToUrl } from "@/contexts/language/utils";
import { defaultLanguage } from "@/contexts/language/constants";

/**
 * Hook zur zentralen Verwaltung aller Authentifizierungs-Weiterleitungen
 * Mit verbesserter Sprachrouting-Unterstützung
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
      return;
    }

    const currentPath = location.pathname;
    const currentLanguage = extractLanguageFromUrl(currentPath);
    const pathWithoutLang = currentPath.replace(`/${currentLanguage}`, '') || '/';
    
    const isAuthPage = ["/login", "/register", "/pre-register", "/pre-register/success", "/forgot-password", "/reset-password"].includes(pathWithoutLang);
    
    try {
      // Falls der Nutzer eingeloggt ist und sich auf einer Auth-Seite befindet
      if (user && isAuthPage) {
        console.log("✅ Authentifizierter Nutzer auf Auth-Seite → Rollenbasiertes Dashboard");
        
        // Prüfe ob das Profil unvollständig ist
        if (profile && !profile.profile_complete) {
          console.log("⚠️ Profil unvollständig → /complete-profile");
          const redirectPath = addLanguageToUrl("/complete-profile", currentLanguage);
          navigate(redirectPath, { replace: true });
          return;
        }
        
        // Direkte Weiterleitung zum richtigen Dashboard mit Sprachpräfix
        const basePath = profile ? getRoleBasedRedirectPath(profile.role) : "/dashboard";
        const redirectPath = addLanguageToUrl(basePath, currentLanguage);
        navigate(redirectPath, { replace: true });
        return;
      }

      // Wenn nicht authentifiziert und auf geschützter Route
      if (!user && !isPublicRoute(pathWithoutLang) && !isAuthPage) {
        console.log("🔒 Nicht authentifiziert → /login");
        const loginPath = addLanguageToUrl("/login", currentLanguage);
        navigate(loginPath, {
          state: { from: currentPath },
          replace: true
        });
        return;
      }
    } catch (error) {
      console.error("Navigation error in auth redirect:", error);
      // Bei Navigation-Fehlern sicher zur Startseite weiterleiten
      const homePath = addLanguageToUrl("/", currentLanguage);
      if (currentPath !== homePath) {
        navigate(homePath, { replace: true });
      }
    }
  }, [user, profile, loading, location.pathname, navigate]);
}

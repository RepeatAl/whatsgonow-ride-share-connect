
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";
import { getRoleBasedRedirectPath, getCurrentLanguage } from "@/utils/auth-utils";

/**
 * Vereinfachter Auth-Redirect Hook mit Profile-Loading-State
 * Wartet bis sowohl User als auch Profile geladen sind, bevor Redirect erfolgt
 */
export function useSimpleAuthRedirect(
  user: User | null,
  profile: UserProfile | null,
  loading: boolean,
  isProfileLoading: boolean  // Neuer Parameter
) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || isProfileLoading) {
      console.log("🔄 Auth/Profile still loading, waiting...");
      return;
    }

    const currentPath = location.pathname;
    const currentLanguage = getCurrentLanguage(currentPath);
    
    console.log("🔄 Auth redirect check:");
    console.log("🔄 Current path:", currentPath);
    console.log("🔄 Current language:", currentLanguage);
    console.log("🔄 User:", user?.email || "none");
    console.log("🔄 Profile role:", profile?.role || "none");
    console.log("🔄 Loading:", loading, "Profile Loading:", isProfileLoading);
    
    // Auth-Seiten (Login, Register, etc.)
    const isAuthPage = [
      `/${currentLanguage}/login`,
      `/${currentLanguage}/register`,
      `/${currentLanguage}/pre-register`,
      `/${currentLanguage}/forgot-password`,
      `/${currentLanguage}/reset-password`
    ].some(path => currentPath.startsWith(path));
    
    // Öffentliche Seiten
    const isPublicPage = [
      `/${currentLanguage}`,
      `/${currentLanguage}/about`,
      `/${currentLanguage}/faq`,
      `/${currentLanguage}/support`,
      `/${currentLanguage}/legal`,
      `/${currentLanguage}/privacy-policy`
    ].includes(currentPath);

    try {
      // Fall 1: Authentifizierter User auf Auth-Seite - ABER nur wenn Profile auch da ist
      if (user && profile && isAuthPage && !loading && !isProfileLoading) {
        const targetPath = getRoleBasedRedirectPath(profile.role, currentLanguage);
        console.log("🔄 Authenticated user with profile ready, redirecting to:", targetPath);
        navigate(targetPath, { replace: true });
        return;
      }

      // Fall 1b: User eingeloggt, aber Profil fehlt dauerhaft (nach Timeout)
      if (user && !profile && isAuthPage && !loading && !isProfileLoading) {
        console.log("🔄 User without profile, staying on auth page with info");
        // Hier könnten wir eine spezielle Meldung anzeigen, aber nicht redirecten
        return;
      }

      // Fall 2: Nicht authentifiziert auf geschützter Route
      if (!user && !isAuthPage && !isPublicPage && !currentPath.startsWith('/mobile-upload') && !currentPath.startsWith('/delivery') && !currentPath.startsWith('/invoice-download')) {
        const loginPath = `/${currentLanguage}/login`;
        console.log("🔄 Unauthenticated user on protected route, redirecting to:", loginPath);
        navigate(loginPath, {
          state: { from: currentPath },
          replace: true
        });
        return;
      }

      // Fall 3: Profile unvollständig (nur wenn Profile geladen wurde)
      if (user && profile && !profile.profile_complete && !currentPath.includes('/complete-profile') && !isProfileLoading) {
        const completePath = `/${currentLanguage}/complete-profile`;
        console.log("🔄 Incomplete profile, redirecting to:", completePath);
        navigate(completePath, { replace: true });
        return;
      }

      console.log("🔄 No redirect needed, staying on current page");
    } catch (error) {
      console.error("🔄 Navigation error in auth redirect:", error);
      // Bei Navigation-Fehlern sicher zur Startseite weiterleiten
      const homePath = `/${currentLanguage}`;
      if (currentPath !== homePath) {
        console.log("🔄 Navigation error, redirecting to home:", homePath);
        navigate(homePath, { replace: true });
      }
    }
  }, [user, profile, loading, isProfileLoading, location.pathname, navigate]);
}

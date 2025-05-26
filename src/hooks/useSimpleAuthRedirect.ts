
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

/**
 * Simplified Auth Redirect Hook
 * Handles redirects after successful authentication
 * Waits for BOTH user AND profile to be loaded before redirecting
 */
export function useSimpleAuthRedirect(
  user: User | null,
  profile: UserProfile | null,
  loading: boolean,
  isProfileLoading: boolean
) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguageMCP();

  useEffect(() => {
    // Don't redirect while loading
    if (loading || isProfileLoading) {
      console.log("🔄 Auth redirect waiting for loading to complete...", { loading, isProfileLoading });
      return;
    }

    const currentPath = location.pathname;
    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register') || 
                      currentPath.includes('/pre-register');

    // If user is authenticated and on auth page, redirect to role-specific dashboard
    if (user && profile && isAuthPage) {
      console.log("✅ User authenticated with profile, redirecting from auth page", { 
        role: profile.role,
        currentPath 
      });
      
      // Rollenbasierte Weiterleitung
      let dashboardPath = `/${currentLanguage}/dashboard`;
      
      switch (profile.role) {
        case "sender_private":
        case "sender_business":
          dashboardPath = `/${currentLanguage}/dashboard/sender`;
          break;
        case "driver":
          dashboardPath = `/${currentLanguage}/dashboard/driver`;
          break;
        case "cm":
          dashboardPath = `/${currentLanguage}/dashboard/cm`;
          break;
        case "admin":
        case "super_admin":
          dashboardPath = `/${currentLanguage}/dashboard/admin`;
          break;
        default:
          // Fallback zum Hauptdashboard (mit rollenbasierter Weiterleitung)
          dashboardPath = `/${currentLanguage}/dashboard`;
      }
      
      console.log("🎯 Redirecting to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
      return;
    }

    // If user is authenticated but no profile, redirect to complete profile
    if (user && !profile && !isAuthPage) {
      console.log("⚠️ User authenticated but no profile, redirecting to profile");
      const profilePath = `/${currentLanguage}/profile`;
      navigate(profilePath, { replace: true });
      return;
    }

    // If not authenticated and trying to access protected route
    if (!user && !isAuthPage && !currentPath.includes('/about') && !currentPath.includes('/faq') && currentPath !== `/${currentLanguage}`) {
      console.log("🔒 Not authenticated, redirecting to login");
      const loginPath = `/${currentLanguage}/login`;
      navigate(loginPath, { replace: true });
      return;
    }

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage]);
}

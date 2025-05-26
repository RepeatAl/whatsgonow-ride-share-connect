
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

/**
 * Simplified Auth Redirect Hook
 * Handles redirects after successful authentication
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
      console.log("🔄 Auth redirect waiting for loading to complete...");
      return;
    }

    const currentPath = location.pathname;
    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register') || 
                      currentPath.includes('/pre-register');

    // If user is authenticated and on auth page, redirect to dashboard
    if (user && profile && isAuthPage) {
      console.log("✅ User authenticated, redirecting from auth page to dashboard");
      const dashboardPath = `/${currentLanguage}/dashboard`;
      navigate(dashboardPath, { replace: true });
      return;
    }

    // If user is authenticated but no profile, redirect to complete profile
    if (user && !profile && !isAuthPage) {
      console.log("⚠️ User authenticated but no profile, redirecting to register");
      const registerPath = `/${currentLanguage}/register`;
      navigate(registerPath, { replace: true });
      return;
    }

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage]);
}

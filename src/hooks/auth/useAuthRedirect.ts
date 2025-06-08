
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { isPublicRoute, isAlwaysPublicRoute } from '@/routes/publicRoutes';

export const useAuthRedirect = (
  user: User | null,
  profile: UserProfile | null,
  loading: boolean,
  isProfileLoading: boolean
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage, getLocalizedUrl } = useLanguageMCP();
  const redirectedRef = useRef(false);

  // Helper function to get dashboard path based on role
  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return getLocalizedUrl('/dashboard/admin');
      case 'cm':
        return getLocalizedUrl('/dashboard/cm');
      case 'driver':
        return getLocalizedUrl('/dashboard/driver');
      case 'sender_private':
      case 'sender_business':
        return getLocalizedUrl('/dashboard/sender');
      default:
        return getLocalizedUrl('/dashboard');
    }
  };

  useEffect(() => {
    // ENHANCED: Debug logging for session diagnosis
    console.debug("🔄 useAuthRedirect: Debug Info", { 
      loading, 
      isProfileLoading,
      hasUser: !!user, 
      hasProfile: !!profile,
      profileComplete: profile?.profile_complete,
      onboardingComplete: profile?.onboarding_complete,
      userRole: profile?.role,
      currentPath: location.pathname,
      alreadyRedirected: redirectedRef.current 
    });

    // Reset redirect flag when auth state changes significantly
    if (loading || isProfileLoading) {
      redirectedRef.current = false;
      console.debug('🔄 useAuthRedirect: Still loading...', { loading, isProfileLoading });
      return;
    }

    const currentPath = location.pathname;
    console.debug('🧭 useAuthRedirect: Checking redirect for path:', currentPath);

    // ENHANCED: Improved auth page detection including pre-register
    const isAuthPage = /^\/[a-z]{2}\/(login|register)$|^\/(login|register)$/.test(currentPath);
    const isPreRegisterPage = /^\/[a-z]{2}\/pre-register$|^\/pre-register$/.test(currentPath);

    // CRITICAL FIX: Handle authenticated user on login/register/pre-register pages immediately
    if (user && profile && (isAuthPage || isPreRegisterPage) && !redirectedRef.current) {
      redirectedRef.current = true;
      console.debug('✅ useAuthRedirect: Authenticated user on auth/pre-register page, redirecting to dashboard');
      
      const targetPath = getDashboardPath(profile.role);
      console.debug('🎯 useAuthRedirect: Redirecting to:', targetPath);
      
      navigate(targetPath, { replace: true });
      return;
    }

    // CRITICAL FIX: Handle authenticated user on home page "/" or language root "/de" with complete profile
    if (
      user && 
      profile && 
      profile.profile_complete && 
      (currentPath === '/' || /^\/[a-z]{2}\/?$/.test(currentPath)) && 
      !redirectedRef.current
    ) {
      redirectedRef.current = true;
      console.debug('🏠 useAuthRedirect: Authenticated user on home/language page with complete profile, redirecting to dashboard');
      
      const targetPath = getDashboardPath(profile.role);
      console.debug('🎯 useAuthRedirect: Redirecting from home to:', targetPath);
      
      navigate(targetPath, { replace: true });
      return;
    }

    // ENHANCED: Allow dashboard access with profile_complete=true even if onboarding_complete=false
    const isDashboardRoute = currentPath.includes('/dashboard');
    if (
      user && 
      profile && 
      profile.profile_complete &&
      !profile.onboarding_complete &&
      isDashboardRoute
    ) {
      console.debug('⚠️ useAuthRedirect: Profile complete but onboarding incomplete - allowing dashboard access with warning');
      // Allow access but could show a warning banner
      return;
    }

    // CRITICAL FIX: Handle authenticated user on other public routes with complete profile
    // BUT allow always-public routes to remain accessible
    if (
      user && 
      profile && 
      profile.profile_complete &&
      isPublicRoute(currentPath) &&
      !isAlwaysPublicRoute(currentPath) && // ENHANCED: Allow always-public routes
      !currentPath.includes('/pre-register') && // Pre-registration blockiert für eingeloggte User
      !redirectedRef.current
    ) {
      redirectedRef.current = true;
      console.debug('🔄 useAuthRedirect: Authenticated user on non-always-public route, redirecting to dashboard');
      
      const targetPath = getDashboardPath(profile.role);
      navigate(targetPath, { replace: true });
      return;
    }

    // Skip public routes (except specific redirects handled above)
    if (isPublicRoute(currentPath)) {
      return;
    }

    // Nicht authentifiziert + geschützte Route → Login
    if (!user && !isPublicRoute(currentPath)) {
      console.debug('🔒 useAuthRedirect: Unauthenticated user on protected route, redirecting to login');
      navigate(getLocalizedUrl('/login'), { replace: true });
      return;
    }

    // User authentifiziert aber kein Profile → Profile vervollständigen
    if (user && !profile) {
      console.debug('⚠️ useAuthRedirect: Authenticated user without profile, redirecting to complete-profile');
      navigate(getLocalizedUrl('/complete-profile'), { replace: true });
      return;
    }

    // FIXED: Only redirect to complete-profile if profile_complete is false (ignore onboarding_complete for dashboard access)
    if (user && profile && !profile.profile_complete) {
      const isCompleteProfileRoute = currentPath.includes('/complete-profile');
      if (!isCompleteProfileRoute) {
        console.debug('⚠️ useAuthRedirect: Profile incomplete, redirecting to complete-profile');
        navigate(getLocalizedUrl('/complete-profile'), { replace: true });
        return;
      }
    }

    // FIXED: Profile complete but on complete-profile page → redirect to dashboard
    if (user && profile && profile.profile_complete && currentPath.includes('/complete-profile')) {
      redirectedRef.current = true;
      console.debug('🎯 useAuthRedirect: Profile complete, skipping completion page, going to dashboard');
      
      const targetPath = getDashboardPath(profile.role);
      navigate(targetPath, { replace: true });
      return;
    }

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage, getLocalizedUrl]);

  // Reset redirect flag when location changes significantly
  useEffect(() => {
    const timer = setTimeout(() => {
      redirectedRef.current = false;
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
};

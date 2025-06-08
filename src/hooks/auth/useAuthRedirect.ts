
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { isPublicRoute } from '@/routes/publicRoutes';

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
    // Reset redirect flag when auth state changes significantly
    if (loading || isProfileLoading) {
      redirectedRef.current = false;
      console.log('🔄 useAuthRedirect: Still loading...', { loading, isProfileLoading });
      return;
    }

    const currentPath = location.pathname;
    console.log('🧭 useAuthRedirect: Checking redirect for path:', currentPath);

    // ENHANCED: Improved auth page detection including pre-register
    const isAuthPage = /^\/[a-z]{2}\/(login|register)$|^\/(login|register)$/.test(currentPath);
    const isPreRegisterPage = /^\/[a-z]{2}\/pre-register$|^\/pre-register$/.test(currentPath);

    console.log('🔍 useAuthRedirect: Auth page check:', { 
      currentPath, 
      isAuthPage,
      isPreRegisterPage,
      hasUser: !!user, 
      hasProfile: !!profile,
      profileComplete: profile?.profile_complete,
      onboardingComplete: profile?.onboarding_complete,
      userRole: profile?.role,
      alreadyRedirected: redirectedRef.current 
    });

    // CRITICAL FIX: Handle authenticated user on login/register pages immediately
    if (user && profile && (isAuthPage || isPreRegisterPage) && !redirectedRef.current) {
      redirectedRef.current = true;
      console.log('✅ useAuthRedirect: Authenticated user on auth/pre-register page, redirecting to dashboard');
      
      const targetPath = getDashboardPath(profile.role);
      console.log('🎯 useAuthRedirect: Redirecting to:', targetPath);
      
      navigate(targetPath, { replace: true });
      return;
    }

    // CRITICAL FIX: Handle authenticated user on home page "/" with complete profile
    if (
      user && 
      profile && 
      profile.profile_complete && 
      currentPath === '/' && 
      !redirectedRef.current
    ) {
      redirectedRef.current = true;
      console.log('🏠 useAuthRedirect: Authenticated user on home page with complete profile, redirecting to dashboard');
      
      const targetPath = getDashboardPath(profile.role);
      console.log('🎯 useAuthRedirect: Redirecting from home to:', targetPath);
      
      navigate(targetPath, { replace: true });
      return;
    }

    // ENHANCED: Handle authenticated user on language-only routes like /de, /en etc
    if (
      user && 
      profile && 
      profile.profile_complete &&
      /^\/[a-z]{2}\/?$/.test(currentPath) &&
      !redirectedRef.current
    ) {
      redirectedRef.current = true;
      console.log('🌐 useAuthRedirect: Authenticated user on language root, redirecting to dashboard');
      
      const targetPath = getDashboardPath(profile.role);
      navigate(targetPath, { replace: true });
      return;
    }

    // CRITICAL FIX: Handle authenticated user on other public routes with complete profile
    if (
      user && 
      profile && 
      profile.profile_complete &&
      isPublicRoute(currentPath) &&
      !currentPath.includes('/pre-register') && // Pre-registration blockiert für eingeloggte User
      !redirectedRef.current
    ) {
      // Allow specific public routes to remain accessible even after login
      const allowedPublicRoutesAfterLogin = [
        '/faq', '/about', '/support', '/transport-search', 
        '/items-browse', '/rides-public', '/map-view', 
        '/video-gallery', '/esg-dashboard', '/here-maps-demo', '/here-maps-features'
      ];
      
      const pathWithoutLanguage = currentPath.replace(/^\/[a-z]{2}\//, '/');
      
      if (!allowedPublicRoutesAfterLogin.some(route => pathWithoutLanguage.startsWith(route))) {
        redirectedRef.current = true;
        console.log('🔄 useAuthRedirect: Authenticated user on other public route, redirecting to dashboard');
        
        const targetPath = getDashboardPath(profile.role);
        navigate(targetPath, { replace: true });
        return;
      }
    }

    // Skip public routes (except specific redirects handled above)
    if (isPublicRoute(currentPath)) {
      return;
    }

    // Nicht authentifiziert + geschützte Route → Login
    if (!user && !isPublicRoute(currentPath)) {
      console.log('🔒 useAuthRedirect: Unauthenticated user on protected route, redirecting to login');
      navigate(getLocalizedUrl('/login'), { replace: true });
      return;
    }

    // User authentifiziert aber kein Profile → Profile vervollständigen
    if (user && !profile) {
      console.log('⚠️ useAuthRedirect: Authenticated user without profile, redirecting to complete-profile');
      navigate(getLocalizedUrl('/complete-profile'), { replace: true });
      return;
    }

    // FIXED: Profile vorhanden aber incomplete → Complete Profile
    if (user && profile && !profile.profile_complete) {
      const isCompleteProfileRoute = currentPath.includes('/complete-profile');
      if (!isCompleteProfileRoute) {
        console.log('⚠️ useAuthRedirect: Profile incomplete, redirecting to complete-profile');
        navigate(getLocalizedUrl('/complete-profile'), { replace: true });
        return;
      }
    }

    // FIXED: Profile complete but on complete-profile page → redirect to dashboard
    if (user && profile && profile.profile_complete && currentPath.includes('/complete-profile')) {
      redirectedRef.current = true;
      console.log('🎯 useAuthRedirect: Profile complete, skipping completion page, going to dashboard');
      
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


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

  useEffect(() => {
    // Reset redirect flag when auth state changes significantly
    if (loading || isProfileLoading) {
      redirectedRef.current = false;
      console.log('🔄 useAuthRedirect: Still loading...', { loading, isProfileLoading });
      return;
    }

    const currentPath = location.pathname;
    console.log('🧭 useAuthRedirect: Checking redirect for path:', currentPath);

    // Precise auth page detection with regex for language prefixes
    const isStrictAuthPage = /^\/[a-z]{2}\/(login|register)$/.test(currentPath) || 
                            /^\/(login|register)$/.test(currentPath);

    console.log('🔍 useAuthRedirect: Auth page check:', { 
      currentPath, 
      isStrictAuthPage, 
      hasUser: !!user, 
      hasProfile: !!profile,
      profileComplete: profile?.profile_complete,
      onboardingComplete: profile?.onboarding_complete,
      userRole: profile?.role,
      alreadyRedirected: redirectedRef.current 
    });

    // Öffentliche Routen überspringen (außer Login/Register bei authentifizierten Usern)
    if (isPublicRoute(currentPath)) {
      // Authentifiziert + auf Auth-Seite → Dashboard (mit Loop-Prevention)
      if (user && profile && isStrictAuthPage && !redirectedRef.current) {
        redirectedRef.current = true;
        console.log('✅ useAuthRedirect: Authenticated user on auth page, redirecting to dashboard');
        
        // FIXED: Use consistent dashboard structure with 100ms delay
        let targetPath: string;
        
        switch (profile.role) {
          case 'admin':
          case 'super_admin':
            targetPath = getLocalizedUrl('/dashboard/admin');
            break;
          case 'cm':
            targetPath = getLocalizedUrl('/dashboard/cm');
            break;
          case 'driver':
            targetPath = getLocalizedUrl('/dashboard/driver');
            break;
          case 'sender_private':
          case 'sender_business':
            targetPath = getLocalizedUrl('/dashboard/sender');
            break;
          default:
            targetPath = getLocalizedUrl('/dashboard');
        }
        
        console.log('🎯 useAuthRedirect: Redirecting to:', targetPath);
        
        // Use timeout for clean redirect timing
        setTimeout(() => {
          navigate(targetPath, { replace: true });
        }, 100);
        
        return;
      }

      // Für andere öffentliche Routen nichts tun
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

    // FIXED: Profile vorhanden aber incomplete → Dashboard direkt bei drivers mit profile_complete
    if (user && profile && profile.profile_complete) {
      // Wenn Profile complete ist, direkt zum Dashboard - unabhängig vom Onboarding-Status
      const isDashboardRoute = currentPath.includes('/dashboard');
      const isCompleteProfileRoute = currentPath.includes('/complete-profile');
      
      if (isCompleteProfileRoute && !redirectedRef.current) {
        redirectedRef.current = true;
        console.log('🎯 useAuthRedirect: Profile complete, skipping completion page, going to dashboard');
        
        let targetPath: string;
        switch (profile.role) {
          case 'admin':
          case 'super_admin':
            targetPath = getLocalizedUrl('/dashboard/admin');
            break;
          case 'cm':
            targetPath = getLocalizedUrl('/dashboard/cm');
            break;
          case 'driver':
            targetPath = getLocalizedUrl('/dashboard/driver');
            break;
          case 'sender_private':
          case 'sender_business':
            targetPath = getLocalizedUrl('/dashboard/sender');
            break;
          default:
            targetPath = getLocalizedUrl('/dashboard');
        }
        
        setTimeout(() => {
          navigate(targetPath, { replace: true });
        }, 100);
        
        return;
      }
      
      // Wenn wir bereits auf einer Dashboard-Route sind, alles ok
      if (isDashboardRoute) {
        return;
      }
    }

    // Profile vorhanden aber unvollständig → Complete Profile
    if (user && profile && !profile.profile_complete) {
      const isCompleteProfileRoute = currentPath.includes('/complete-profile');
      if (!isCompleteProfileRoute) {
        console.log('⚠️ useAuthRedirect: Profile incomplete, redirecting to complete-profile');
        navigate(getLocalizedUrl('/complete-profile'), { replace: true });
        return;
      }
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

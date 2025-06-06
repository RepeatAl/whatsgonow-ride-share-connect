
import { useEffect } from 'react';
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

  useEffect(() => {
    // Warten bis Auth und Profile vollständig geladen sind
    if (loading || isProfileLoading) {
      console.log('🔄 useAuthRedirect: Still loading...', { loading, isProfileLoading });
      return;
    }

    const currentPath = location.pathname;
    console.log('🧭 useAuthRedirect: Checking redirect for path:', currentPath);

    // Öffentliche Routen überspringen (außer Login/Register bei authentifizierten Usern)
    if (isPublicRoute(currentPath)) {
      const isAuthPage = currentPath.includes('/login') || 
                        currentPath.includes('/register');

      // Authentifiziert + auf Auth-Seite → Dashboard
      if (user && profile && isAuthPage) {
        console.log('✅ useAuthRedirect: Authenticated user on auth page, redirecting to dashboard');
        
        // Rollenbasierte Weiterleitung
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
        navigate(targetPath, { replace: true });
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

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage, getLocalizedUrl]);
};

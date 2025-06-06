
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
  const { currentLanguage } = useLanguageMCP();

  useEffect(() => {
    if (loading || isProfileLoading) return;

    const currentPath = location.pathname;
    
    // Öffentliche Routen überspringen
    if (isPublicRoute(currentPath)) {
      return;
    }

    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register');

    // Authentifiziert + auf Auth-Seite → Dashboard
    if (user && profile && isAuthPage) {
      console.log('✅ OptimizedAuth: Redirecting authenticated user to dashboard');
      
      // Rollenbasierte Weiterleitung
      let targetPath = `/${currentLanguage}/dashboard`;
      
      switch (profile.role) {
        case 'admin':
        case 'super_admin':
          targetPath = `/${currentLanguage}/dashboard/admin`;
          break;
        case 'cm':
          targetPath = `/${currentLanguage}/dashboard/cm`;
          break;
        case 'driver':
          targetPath = `/${currentLanguage}/dashboard/driver`;
          break;
        case 'sender_private':
        case 'sender_business':
          targetPath = `/${currentLanguage}/dashboard/sender`;
          break;
        default:
          targetPath = `/${currentLanguage}/profile`;
      }
      
      navigate(targetPath, { replace: true });
      return;
    }

    // Nicht authentifiziert + geschützte Route → Login
    if (!user && !isAuthPage) {
      console.log('🔒 OptimizedAuth: Redirecting unauthenticated user to login');
      navigate(`/${currentLanguage}/login`, { replace: true });
      return;
    }

  }, [user, profile, loading, isProfileLoading, location.pathname, navigate, currentLanguage]);
};

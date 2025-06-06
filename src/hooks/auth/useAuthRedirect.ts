
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
      navigate(`/${currentLanguage}/dashboard`, { replace: true });
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

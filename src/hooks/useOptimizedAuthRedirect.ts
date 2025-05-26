
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

export function useOptimizedAuthRedirect(
  user: User | null,
  profile: UserProfile | null,
  isReady: boolean
) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguageMCP();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isReady || hasRedirected.current) {
      return;
    }

    const currentPath = location.pathname;
    const isAuthPage = currentPath.includes('/login') || 
                      currentPath.includes('/register') || 
                      currentPath.includes('/pre-register');

    // If user is authenticated and on auth page, redirect once
    if (user && profile && isAuthPage) {
      console.log('✅ Redirecting authenticated user from auth page');
      hasRedirected.current = true;
      
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
      }
      
      navigate(dashboardPath, { replace: true });
      return;
    }

    // If not authenticated and trying to access protected route
    if (!user && !isAuthPage && !currentPath.includes('/about') && !currentPath.includes('/faq') && currentPath !== `/${currentLanguage}`) {
      console.log('🔒 Redirecting unauthenticated user to login');
      hasRedirected.current = true;
      navigate(`/${currentLanguage}/login`, { replace: true });
      return;
    }

  }, [user, profile, isReady, location.pathname, navigate, currentLanguage]);

  // Reset redirect flag when route changes
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);
}

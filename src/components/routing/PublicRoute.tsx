
import React, { ReactNode } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - FIXED: Simplified logic to prevent redirect loops
 * 
 * Only redirects authenticated users with COMPLETE profiles from auth pages.
 * onboarding_complete is NO LONGER a blocker - only used for UX hints.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user, profile } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  console.debug("🌐 PublicRoute check:", {
    path: location.pathname,
    loading,
    hasUser: !!user,
    hasProfile: !!profile,
    profileComplete: profile?.profile_complete,
    onboardingComplete: profile?.onboarding_complete
  });
  
  // Wait for auth to stabilize
  if (loading) {
    return null;
  }
  
  // Simplified auth page detection
  const isAuthPage = location.pathname.includes('/login') || 
                    location.pathname.includes('/register');
  
  const isPreRegisterPage = location.pathname.includes('/pre-register');
  
  // FIXED: Only redirect authenticated users with COMPLETE profiles from auth pages
  // CRITICAL: onboarding_complete is NO LONGER required for dashboard access
  if (user && profile?.profile_complete && (isAuthPage || isPreRegisterPage)) {
    console.debug('✅ PublicRoute: Redirecting authenticated user with complete profile');
    
    // Simple role-based redirect
    let redirectUrl: string;
    switch (profile.role) {
      case 'admin':
      case 'super_admin':
        redirectUrl = getLocalizedUrl('/dashboard/admin');
        break;
      case 'cm':
        redirectUrl = getLocalizedUrl('/dashboard/cm');
        break;
      case 'driver':
        redirectUrl = getLocalizedUrl('/dashboard/driver');
        break;
      case 'sender_private':
      case 'sender_business':
        redirectUrl = getLocalizedUrl('/dashboard/sender');
        break;
      default:
        redirectUrl = getLocalizedUrl('/dashboard');
    }
    
    return <Navigate to={redirectUrl} replace />;
  }
  
  // FIXED: Redirect incomplete profiles away from pre-register (they should complete their profile first)
  if (user && profile && !profile.profile_complete && isPreRegisterPage) {
    console.debug('⚠️ PublicRoute: Redirecting incomplete profile to complete-profile');
    return <Navigate to={getLocalizedUrl('/complete-profile')} replace />;
  }
  
  // For all other cases: show content publicly
  return <>{children}</>;
};

export default PublicRoute;


import React, { ReactNode } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - FIXED: Simplified to prevent redirect loops
 * 
 * Zeigt Inhalte öffentlich an. Für eingeloggte Nutzer auf Auth-Seiten
 * wird ein rollenbasiertes Dashboard-Redirect durchgeführt.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user, profile } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // FIXED: Wait for auth to stabilize before any redirects
  if (loading) {
    return null;
  }
  
  // FIXED: Simplified auth page detection
  const isAuthPage = location.pathname.includes('/login') || 
                    location.pathname.includes('/register');
  
  const isPreRegisterPage = location.pathname.includes('/pre-register');
  
  // FIXED: Only redirect authenticated users with complete profiles from auth pages
  if (user && profile?.profile_complete && profile?.onboarding_complete && (isAuthPage || isPreRegisterPage)) {
    console.log('[PublicRoute] Redirecting authenticated user with complete profile');
    
    // FIXED: Simple role-based redirect without complex logic
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
  
  // FIXED: Simplified incomplete profile handling
  if (user && profile && (!profile.profile_complete || !profile.onboarding_complete) && isPreRegisterPage) {
    console.log('[PublicRoute] Redirecting incomplete profile to complete-profile');
    return <Navigate to={getLocalizedUrl('/complete-profile')} replace />;
  }
  
  // For all other cases: show content publicly
  return <>{children}</>;
};

export default PublicRoute;

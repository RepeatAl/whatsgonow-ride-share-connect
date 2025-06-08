
import React, { ReactNode } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - Enhanced for better pre-register handling
 * 
 * Zeigt Inhalte öffentlich an. Für eingeloggte Nutzer auf Auth-Seiten
 * wird ein rollenbasiertes Dashboard-Redirect durchgeführt.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user, profile } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // Während des Ladens: Inhalt nicht anzeigen
  if (loading) {
    return null;
  }
  
  // ENHANCED: Prüfe ob wir auf einer strikten Auth-Seite oder Pre-Register sind
  const isStrictAuthPage = location.pathname.includes('/login') || 
                          (location.pathname.includes('/register') && !location.pathname.includes('/pre-register'));
  
  const isPreRegisterPage = location.pathname.includes('/pre-register');
                       
  // CRITICAL: Wenn angemeldeter Nutzer mit vollständigem Profil versucht auf Auth-Seiten oder Pre-Register zu gehen → Dashboard
  if (user && profile && profile.profile_complete && (isStrictAuthPage || isPreRegisterPage)) {
    console.log('[PublicRoute] Authenticated user with complete profile on auth/pre-register page - redirecting to dashboard');
    
    // Rollenbasiertes Redirect
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
  
  // ENHANCED: Wenn angemeldeter Nutzer ohne vollständiges Profil auf Pre-Register geht → Complete Profile
  if (user && profile && !profile.profile_complete && isPreRegisterPage) {
    console.log('[PublicRoute] Authenticated user with incomplete profile on pre-register - redirecting to complete-profile');
    return <Navigate to={getLocalizedUrl('/complete-profile')} replace />;
  }
  
  // Für alle anderen Seiten: Einfach anzeigen (öffentlich)
  return <>{children}</>;
};

export default PublicRoute;

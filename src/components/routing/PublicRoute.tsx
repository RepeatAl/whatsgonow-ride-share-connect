
import React, { ReactNode } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - Vereinfacht für das neue "öffentlich vs. geschützt" System
 * 
 * Zeigt Inhalte öffentlich an. Nur noch bei strikten Auth-Seiten (login/register)
 * wird ein Redirect für bereits angemeldete Nutzer durchgeführt.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user, profile } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // Während des Ladens: Inhalt nicht anzeigen
  if (loading) {
    return null;
  }
  
  // Prüfe ob wir auf einer strikten Auth-Seite sind
  const isStrictAuthPage = location.pathname.includes('/login') || 
                          (location.pathname.includes('/register') && !location.pathname.includes('/pre-register'));
                       
  // Wenn angemeldeter Nutzer versucht auf Login/Register zu gehen → Dashboard
  if (user && profile && isStrictAuthPage) {
    console.log('[PublicRoute] Authenticated user on auth page - redirecting to dashboard');
    
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
  
  // Für alle anderen Seiten: Einfach anzeigen (öffentlich)
  return <>{children}</>;
};

export default PublicRoute;


import React, { ReactNode } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { isPublicRoute } from "@/routes/publicRoutes";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - Updated for OptimizedAuth integration
 * Uses centralized isPublicRoute() check from publicRoutes.ts
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user, profile } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  console.log('[PublicRoute] Current path:', location.pathname);
  console.log('[PublicRoute] Is public route:', isPublicRoute(location.pathname));
  console.log('[PublicRoute] Loading:', loading, 'User:', !!user, 'Profile:', !!profile);
  
  // Check if current path is public using the centralized function
  if (isPublicRoute(location.pathname)) {
    console.log('[PublicRoute] Path is public - checking auth status');
    
    // Check if we're on a strict auth page (login/register)
    const isStrictAuthPage = location.pathname.includes('/login') || 
                            (location.pathname.includes('/register') && !location.pathname.includes('/pre-register'));
                       
    // If user is authenticated and tries to access auth pages, redirect them
    if (!loading && user && profile && isStrictAuthPage) {
      console.log('[PublicRoute] Authenticated user on auth page - redirecting to dashboard');
      
      // Role-based redirect
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
    
    // For all other public routes, render when not loading
    console.log('[PublicRoute] Rendering public route content');
    return <>{!loading && children}</>;
  }
  
  // For non-public routes, this component shouldn't be used, but render anyway
  console.log('[PublicRoute] Non-public route - rendering content');
  return <>{!loading && children}</>;
};

export default PublicRoute;

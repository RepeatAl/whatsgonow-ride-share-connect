
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
  const { loading, user } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  console.log('[PublicRoute] Current path:', location.pathname);
  console.log('[PublicRoute] Is public route:', isPublicRoute(location.pathname));
  console.log('[PublicRoute] Loading:', loading, 'User:', !!user);
  
  // Check if current path is public using the centralized function
  if (isPublicRoute(location.pathname)) {
    console.log('[PublicRoute] Path is public - rendering without auth check');
    return <>{!loading && children}</>;
  }
  
  // Check if we're coming from another page (redirect)
  const from = location.state?.from || '/';
  
  // If user is authenticated and tries to access strict auth pages, redirect them
  const isStrictAuthPage = location.pathname.includes('/login') || 
                          (location.pathname.includes('/register') && !location.pathname.includes('/pre-register'));
                     
  if (!loading && user && isStrictAuthPage) {
    const redirectUrl = getLocalizedUrl(from !== '/' ? from : '/dashboard');
    console.log('[PublicRoute] Authenticated user on auth page - redirecting to:', redirectUrl);
    return <Navigate to={redirectUrl} replace />;
  }
  
  // For all other public routes, render when not loading
  console.log('[PublicRoute] Rendering public route content');
  return <>{!loading && children}</>;
};

export default PublicRoute;

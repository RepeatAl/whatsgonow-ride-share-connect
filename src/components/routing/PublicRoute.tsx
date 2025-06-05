
import React, { ReactNode } from "react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { isPublicRoute } from "@/routes/publicRoutes";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - Updated for SimpleAuth integration
 * CRITICAL: This route must check if path is public BEFORE any auth redirects
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user } = useSimpleAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  console.log('[PublicRoute] Current path:', location.pathname);
  console.log('[PublicRoute] Is public route:', isPublicRoute(location.pathname));
  console.log('[PublicRoute] Loading:', loading, 'User:', !!user);
  
  // CRITICAL: Always allow pre-register routes
  if (location.pathname.includes('pre-register')) {
    console.log('[PublicRoute] Pre-register route - always allowed');
    return <>{!loading && children}</>;
  }
  
  // CRITICAL: Always allow here-maps-demo routes
  if (location.pathname.includes('here-maps-demo')) {
    console.log('[PublicRoute] Here maps demo route - always allowed');
    return <>{!loading && children}</>;
  }
  
  // CRITICAL: Check if current path is public FIRST
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

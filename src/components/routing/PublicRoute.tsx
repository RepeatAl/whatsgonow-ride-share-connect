
import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - Phase 1 MCP Integration
 * Uses unified LanguageMCP instead of multiple language providers
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user } = useAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  console.log('[PUBLIC-ROUTE] Current path:', location.pathname);
  console.log('[PUBLIC-ROUTE] User:', user?.email || 'none');
  console.log('[PUBLIC-ROUTE] Loading:', loading);
  
  // Special handling for pre-register route - always allow
  if (location.pathname.includes('pre-register')) {
    console.log('[PUBLIC-ROUTE] Pre-register route - allowing access');
    return <>{!loading && children}</>;
  }
  
  // Check if we're coming from another page (redirect)
  const from = location.state?.from || '/';
  
  // If user is authenticated and tries to access strict auth pages, redirect them
  const isStrictAuthPage = location.pathname.includes('/login') || 
                          (location.pathname.includes('/register') && !location.pathname.includes('/pre-register'));
                     
  if (!loading && user && isStrictAuthPage) {
    console.log('[PUBLIC-ROUTE] Authenticated user on auth page - redirecting');
    const redirectUrl = getLocalizedUrl(from !== '/' ? from : '/dashboard');
    return <Navigate to={redirectUrl} replace />;
  }
  
  // For all other public routes, render when not loading
  console.log('[PUBLIC-ROUTE] Rendering public content');
  return <>{!loading && children}</>;
};

export default PublicRoute;

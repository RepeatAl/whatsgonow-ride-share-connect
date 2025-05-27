
import React, { ReactNode } from "react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * PublicRoute - Updated for SimpleAuth integration
 * Uses unified SimpleAuth instead of legacy auth providers
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user } = useSimpleAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // Special handling for pre-register route - always allow
  if (location.pathname.includes('pre-register')) {
    return <>{!loading && children}</>;
  }
  
  // Check if we're coming from another page (redirect)
  const from = location.state?.from || '/';
  
  // If user is authenticated and tries to access strict auth pages, redirect them
  const isStrictAuthPage = location.pathname.includes('/login') || 
                          (location.pathname.includes('/register') && !location.pathname.includes('/pre-register'));
                     
  if (!loading && user && isStrictAuthPage) {
    const redirectUrl = getLocalizedUrl(from !== '/' ? from : '/dashboard');
    return <Navigate to={redirectUrl} replace />;
  }
  
  // For all other public routes, render when not loading
  return <>{!loading && children}</>;
};

export default PublicRoute;

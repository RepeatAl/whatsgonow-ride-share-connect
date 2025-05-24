
import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useOptimizedLanguage } from "@/contexts/language/OptimizedLanguageProvider";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { loading, user } = useAuth();
  const location = useLocation();
  const { getLocalizedUrl, currentLanguage } = useOptimizedLanguage();
  
  console.log('[PublicRoute] === SIMPLIFIED DEBUG ===');
  console.log('[PublicRoute] Current path:', location.pathname);
  console.log('[PublicRoute] User:', user ? 'authenticated' : 'not authenticated');
  console.log('[PublicRoute] Loading:', loading);
  
  // Special handling for pre-register route
  if (location.pathname.includes('pre-register')) {
    console.log('[PublicRoute] *** PRE-REGISTER ROUTE DETECTED ***');
    console.log('[PublicRoute] Will render pre-register component immediately');
    console.log('[PublicRoute] Loading state:', loading);
  }
  
  // Check if we're coming from another page (redirect)
  const from = location.state?.from || '/';
  
  // If user is authenticated and tries to access strict auth pages, redirect them
  const isStrictAuthPage = location.pathname.includes('/login') || 
                          (location.pathname.includes('/register') && !location.pathname.includes('/pre-register'));
  
  console.log('[PublicRoute] Is strict auth page:', isStrictAuthPage);
                     
  if (!loading && user && isStrictAuthPage) {
    console.log('[PublicRoute] Redirecting authenticated user away from auth page');
    const redirectUrl = getLocalizedUrl(from !== '/' ? from : '/dashboard', currentLanguage);
    return <Navigate to={redirectUrl} replace />;
  }
  
  // For all other public routes (including pre-register), render immediately when not loading
  console.log('[PublicRoute] Rendering children for public route');
  
  return <>{!loading && children}</>;
};

export default PublicRoute;

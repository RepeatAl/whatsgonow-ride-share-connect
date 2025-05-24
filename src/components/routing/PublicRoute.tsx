
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
  
  console.log('[PublicRoute] Current path:', location.pathname);
  console.log('[PublicRoute] User:', user ? 'authenticated' : 'not authenticated');
  console.log('[PublicRoute] Loading:', loading);
  
  // Check if we're coming from another page (redirect)
  const from = location.state?.from || '/';
  
  // If user is authenticated and tries to access login/register pages, redirect them
  const isAuthPage = location.pathname.includes('/login') || 
                     location.pathname.includes('/register');
  
  // Pre-register is NOT an auth page - it's accessible to everyone
  const isPreRegisterPage = location.pathname.includes('/pre-register');
  
  console.log('[PublicRoute] Is auth page:', isAuthPage);
  console.log('[PublicRoute] Is pre-register page:', isPreRegisterPage);
                     
  if (!loading && user && isAuthPage && !isPreRegisterPage) {
    // Only redirect if it's a strict auth page (login/register), not pre-register
    console.log('[PublicRoute] Redirecting authenticated user away from auth page');
    const redirectUrl = getLocalizedUrl(from !== '/' ? from : '/dashboard', currentLanguage);
    return <Navigate to={redirectUrl} replace />;
  }
  
  // For all other public routes (including pre-register), simply render the children when not loading
  console.log('[PublicRoute] Rendering children for public route');
  return <>{!loading && children}</>;
};

export default PublicRoute;

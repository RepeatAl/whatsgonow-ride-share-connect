
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
  
  // Check if we're coming from another page (redirect)
  const from = location.state?.from || '/';
  
  // If user is authenticated and tries to access login/register pages, redirect them
  const isAuthPage = location.pathname.includes('/login') || 
                     location.pathname.includes('/register');
                     
  if (!loading && user && isAuthPage) {
    // Preserve language when redirecting authenticated users away from auth pages
    const redirectUrl = getLocalizedUrl(from !== '/' ? from : '/dashboard', currentLanguage);
    return <Navigate to={redirectUrl} replace />;
  }
  
  // For all other public routes, simply render the children when not loading
  return <>{!loading && children}</>;
};

export default PublicRoute;

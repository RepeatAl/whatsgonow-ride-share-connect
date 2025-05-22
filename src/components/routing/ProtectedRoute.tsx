
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLanguage } from "@/contexts/language";
import { extractLanguageFromUrl } from "@/contexts/language/utils";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, sessionExpired } = useAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguage();
  
  // Extract current language from URL path
  const currentLang = extractLanguageFromUrl(location.pathname);
  
  // Show loading spinner only during initial load
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // For all routes, require authentication
  if (!user || sessionExpired) {
    console.log("🔒 Protected route access denied, redirecting to login");
    
    // Create language-aware login redirect URL
    const loginUrl = getLocalizedUrl('/login', currentLang);
    
    return (
      <Navigate 
        to={loginUrl} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  // If roles are specified, check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`🚫 User with role ${user.role} not allowed to access route requiring ${allowedRoles.join(', ')}`);
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated and has the correct role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

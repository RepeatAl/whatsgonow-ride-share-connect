
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading, isProfileLoading } = useSimpleAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // Show loading spinner during auth or profile loading
  if (loading || isProfileLoading) {
    return <LoadingSpinner />;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    console.log("🔒 Protected route access denied, redirecting to login");
    const loginUrl = getLocalizedUrl('/login');
    return (
      <Navigate 
        to={loginUrl} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  // If roles are specified, check if the user has the required role
  if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
    console.log(`🚫 User with role ${profile.role} not allowed to access route requiring ${allowedRoles.join(', ')}`);
    const dashboardUrl = getLocalizedUrl('/dashboard');
    return <Navigate to={dashboardUrl} replace />;
  }
  
  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

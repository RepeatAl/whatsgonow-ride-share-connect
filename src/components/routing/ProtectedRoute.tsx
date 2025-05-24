
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute - Phase 1 MCP Integration
 * Uses unified LanguageMCP for consistent language handling
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, sessionExpired } = useAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // Show loading spinner only during initial load
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // For all routes, require authentication
  if (!user || sessionExpired) {
    console.log("🔒 Protected route access denied, redirecting to login");
    
    // Create language-aware login redirect URL using MCP
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
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`🚫 User with role ${user.role} not allowed to access route requiring ${allowedRoles.join(', ')}`);
    const dashboardUrl = getLocalizedUrl('/dashboard');
    return <Navigate to={dashboardUrl} replace />;
  }
  
  // If authenticated and has the correct role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

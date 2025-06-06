
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, loading, isProfileLoading } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // Show loading spinner during auth or profile loading
  if (loading || isProfileLoading) {
    return <LoadingSpinner />;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    console.log("🔒 Admin route access denied - not authenticated");
    const loginUrl = getLocalizedUrl('/login');
    return (
      <Navigate 
        to={loginUrl} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  // Check if user has admin role
  if (!profile?.role || !['admin', 'super_admin'].includes(profile.role)) {
    console.log(`🚫 Admin route access denied - insufficient role: ${profile?.role}`);
    const dashboardUrl = getLocalizedUrl('/dashboard');
    return <Navigate to={dashboardUrl} replace />;
  }
  
  // If admin, render the protected content
  return <>{children}</>;
};

export default AdminRoute;

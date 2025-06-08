
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute - STABILIZED: profile_complete is the central condition for access
 * onboarding_complete is only for UX hints, not blocking access
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading, isProfileLoading } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  console.debug("🔒 ProtectedRoute check:", {
    path: location.pathname,
    hasUser: !!user,
    hasProfile: !!profile,
    loading,
    isProfileLoading,
    userRole: profile?.role,
    allowedRoles,
    profileComplete: profile?.profile_complete,
    onboardingComplete: profile?.onboarding_complete
  });
  
  // Show loading while auth state is resolving
  if (loading || isProfileLoading) {
    console.debug("🔄 ProtectedRoute: Still loading auth state...");
    return <LoadingSpinner />;
  }
  
  // Not authenticated → redirect to login
  if (!user) {
    console.debug("🔒 ProtectedRoute: No user, redirecting to login");
    const loginUrl = getLocalizedUrl('/login');
    return (
      <Navigate 
        to={loginUrl} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  // CRITICAL: No profile or incomplete profile → redirect to complete profile
  if (!profile || !profile.profile_complete) {
    console.debug("⚠️ ProtectedRoute: Profile incomplete, redirecting to complete-profile");
    return <Navigate to={getLocalizedUrl('/complete-profile')} replace />;
  }
  
  // STABILIZED: profile_complete=true is sufficient for dashboard access
  // onboarding_complete=false is just UX info, not a blocker
  if (profile.profile_complete) {
    console.debug("✅ ProtectedRoute: Profile complete, checking role permissions");
    
    // Role-based access control (if specified)
    if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
      console.debug(`🚫 ProtectedRoute: Role ${profile.role} not allowed for ${allowedRoles.join(', ')}`);
      
      // Redirect to appropriate dashboard based on user's role
      const fallbackUrl = (() => {
        switch (profile.role) {
          case 'admin':
          case 'super_admin':
            return getLocalizedUrl('/dashboard/admin');
          case 'cm':
            return getLocalizedUrl('/dashboard/cm');
          case 'driver':
            return getLocalizedUrl('/dashboard/driver');
          case 'sender_private':
          case 'sender_business':
            return getLocalizedUrl('/dashboard/sender');
          default:
            return getLocalizedUrl('/dashboard');
        }
      })();
      
      return <Navigate to={fallbackUrl} replace />;
    }
    
    // Access granted - show content
    return <>{children}</>;
  }
  
  // Fallback: should not reach here, but redirect to complete profile for safety
  console.debug("⚠️ ProtectedRoute: Unexpected state, redirecting to complete-profile");
  return <Navigate to={getLocalizedUrl('/complete-profile')} replace />;
};

export default ProtectedRoute;

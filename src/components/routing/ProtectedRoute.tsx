
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
 * ProtectedRoute - ENHANCED for better debugging and fallback handling
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading, isProfileLoading } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // ENHANCED: Debug logging
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
  
  // Lade-Zustand anzeigen
  if (loading || isProfileLoading) {
    console.debug("🔄 ProtectedRoute: Still loading...");
    return <LoadingSpinner />;
  }
  
  // Nicht authentifiziert → Login
  if (!user) {
    console.debug("🔒 Protected route access denied, redirecting to login");
    const loginUrl = getLocalizedUrl('/login');
    return (
      <Navigate 
        to={loginUrl} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  // ENHANCED: Allow dashboard access with profile_complete=true even if onboarding incomplete
  const isDashboardRoute = location.pathname.includes('/dashboard');
  if (user && profile && profile.profile_complete && isDashboardRoute) {
    console.debug("✅ ProtectedRoute: Dashboard access granted with complete profile");
    
    // Rollenprüfung (falls spezifiziert)
    if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
      console.debug(`🚫 User with role ${profile.role} not allowed to access route requiring ${allowedRoles.join(', ')}`);
      
      // ENHANCED: Better role-based fallback
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
    
    // Authentifiziert und berechtigt → Inhalt anzeigen
    return <>{children}</>;
  }
  
  // FALLBACK: For non-dashboard routes or incomplete profiles
  if (!profile || !profile.profile_complete) {
    console.debug("⚠️ ProtectedRoute: Profile incomplete, redirecting to complete profile");
    return <Navigate to={getLocalizedUrl('/complete-profile')} replace />;
  }
  
  // Default: Show content
  return <>{children}</>;
};

export default ProtectedRoute;

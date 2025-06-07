
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
 * ProtectedRoute - Vereinfacht für das neue System
 * 
 * Wird nur noch für wirklich geschützte Bereiche verwendet:
 * - Dashboard
 * - Profile
 * - Messages  
 * - Admin-Bereiche
 * 
 * Alle anderen Seiten sind öffentlich, Auth-Checks erfolgen auf Action-Ebene
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading, isProfileLoading } = useOptimizedAuth();
  const location = useLocation();
  const { getLocalizedUrl } = useLanguageMCP();
  
  // Lade-Zustand anzeigen
  if (loading || isProfileLoading) {
    return <LoadingSpinner />;
  }
  
  // Nicht authentifiziert → Login
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
  
  // Rollenprüfung (falls spezifiziert)
  if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
    console.log(`🚫 User with role ${profile.role} not allowed to access route requiring ${allowedRoles.join(', ')}`);
    const dashboardUrl = getLocalizedUrl('/dashboard');
    return <Navigate to={dashboardUrl} replace />;
  }
  
  // Authentifiziert und berechtigt → Inhalt anzeigen
  return <>{children}</>;
};

export default ProtectedRoute;

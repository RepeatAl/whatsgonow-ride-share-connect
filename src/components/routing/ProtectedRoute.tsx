
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isPublicRoute } from "@/routes/publicRoutes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, sessionExpired } = useAuth();
  const location = useLocation();
  
  // Show loading spinner only during initial load
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If current path is public, don't protect it
  if (isPublicRoute(location.pathname)) {
    return <>{children}</>;
  }
  
  // For all other routes, require authentication
  if (!user || sessionExpired) {
    console.log("🔒 Protected route access denied, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated and not public, render the protected content
  return <>{children}</>;
};

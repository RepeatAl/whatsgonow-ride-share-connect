
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner only during initial load
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If no user, redirect to login with current location preserved
  if (!user) {
    console.log("🔒 Protected route access denied, redirecting to pre-register");
    return <Navigate to="/pre-register" state={{ from: location }} replace />;
  }
  
  // If all checks pass, render the protected content
  return <>{children}</>;
};

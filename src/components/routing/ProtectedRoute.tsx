
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading, error, retryProfileLoad } = useAuth();
  const location = useLocation();
  
  // Show loading spinner only during initial load
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If no user, redirect to login with current location preserved
  if (!user) {
    console.log("🔒 Protected route access denied, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If we're already on the profile page and there's an error, show the error
  // This prevents redirect loops when profile has errors
  if (error && location.pathname === "/profile") {
    return (
      <div className="container max-w-md mx-auto py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler beim Laden des Benutzerprofils</AlertTitle>
          <AlertDescription>
            {error.message || "Dein Benutzerprofil konnte nicht geladen werden."}
          </AlertDescription>
        </Alert>
        
        {retryProfileLoad && (
          <Button 
            onClick={retryProfileLoad} 
            className="w-full"
          >
            Erneut versuchen
          </Button>
        )}
      </div>
    );
  }
  
  // If profile error and not on profile page, redirect to profile page
  if (error && location.pathname !== "/profile") {
    console.log("⚠️ Profile error, redirecting to profile page:", error.message);
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }
  
  // If there's no profile and we're not already on the profile page, redirect to profile
  if (!profile && location.pathname !== "/profile") {
    console.log("⚠️ No profile found, redirecting to profile page");
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }
  
  // If all checks pass, render the protected content
  return <>{children}</>;
};

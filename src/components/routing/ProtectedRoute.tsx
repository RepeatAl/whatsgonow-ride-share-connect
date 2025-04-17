
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
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    console.log("🔒 Protected route access denied, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If there's no profile, redirect to profile page unless we're already there
  if (!profile && location.pathname !== "/profile") {
    console.log("⚠️ No profile found, redirecting to profile page");
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }
  
  if (error) {
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
  
  return <>{children}</>;
};

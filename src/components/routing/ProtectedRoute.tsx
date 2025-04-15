
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
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
  
  // Show loading spinner while authentication is in progress
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Show error message if there's an error loading the profile
  if (error && user) {
    return (
      <div className="container max-w-md mx-auto py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler beim Laden des Benutzerprofils</AlertTitle>
          <AlertDescription>
            {error.message || "Dein Benutzerprofil konnte nicht geladen werden. Bitte versuche es erneut."}
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
  
  // Render children if authentication is successful
  return <>{children}</>;
};

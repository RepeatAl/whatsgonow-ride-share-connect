
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
  
  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    console.log("🔒 Protected route access denied, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Show error message if there's an error loading the profile
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
        
        <div className="p-4 bg-muted/40 rounded-md mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Mögliche Ursachen:
          </p>
          <ul className="list-disc pl-4 text-sm text-muted-foreground">
            <li>Netzwerkprobleme</li>
            <li>Datenbankzugriffsfehler</li>
            <li>Profilkonfigurationsprobleme</li>
          </ul>
        </div>
        
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

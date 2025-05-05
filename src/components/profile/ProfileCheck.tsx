
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ProfileCheck({ children }: { children: React.ReactNode }) {
  const { profile, loading, isInitialLoad, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || isInitialLoad) return;

    // First check for incomplete profile
    if (user && profile && !profile.profile_complete && location.pathname !== "/complete-profile") {
      navigate("/complete-profile", { state: { from: location.pathname }, replace: true });
      return;
    }

    // If profile is complete but user is on profile page and is a sender, consider redirecting to create-order
    // Only redirect from main profile page, not from other sections
    if (user && 
        profile && 
        profile.profile_complete && 
        profile.role?.startsWith('sender') && 
        location.pathname === "/profile") {
      
      // You could add additional logic here to check if the user has no active orders
      // For now, we'll just show a notification or hint on the profile page instead of auto-redirecting
      // This is handled in the ProfileTabs component by setting the default tab to 'sender'
    }
  }, [profile, loading, isInitialLoad, user, navigate, location.pathname]);

  if (loading || isInitialLoad) {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Card>
          <CardHeader>
            <CardTitle>Profil wird geladen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-10 h-10 border-4 border-muted-foreground border-t-transparent rounded-full animate-spin mx-auto my-4"></div>
            <p className="text-center">Dein Profil wird überprüft...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Card>
          <CardHeader>
            <CardTitle>Nicht angemeldet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Bitte melde dich an, um fortzufahren.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Card>
          <CardHeader>
            <CardTitle>Profil nicht gefunden</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Dein Profil konnte nicht geladen werden. Bitte lade die Seite neu oder versuche es später erneut.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

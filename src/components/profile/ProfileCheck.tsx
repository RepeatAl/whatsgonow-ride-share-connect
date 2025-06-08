
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { hasValidProfile } from "@/utils/profile-check";
import ProfileErrorRecovery from "@/components/auth/ProfileErrorRecovery";

export function ProfileCheck({ children }: { children: React.ReactNode }) {
  const { 
    profile, 
    loading, 
    user, 
    isProfileLoading, 
    profileError,
    refreshProfile 
  } = useOptimizedAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading || isProfileLoading) return;

    // First check for users with valid session but no profile - SECURITY FIX
    if (user && !hasValidProfile(profile)) {
      console.warn("⚠️ Kein Profil gefunden – Weiterleitung zu /register");
      navigate("/register", { state: { from: location.pathname }, replace: true });
      return;
    }

    // ENHANCED: Check for incomplete profile OR incomplete onboarding
    if (user && profile && (!profile.profile_complete || !profile.onboarding_complete) && location.pathname !== "/complete-profile") {
      console.log("⚠️ Profile or onboarding incomplete, redirecting to complete-profile");
      navigate("/complete-profile", { state: { from: location.pathname }, replace: true });
      return;
    }
  }, [profile, loading, isProfileLoading, user, navigate, location.pathname]);

  // Show profile error recovery if there's an error
  if (user && profileError) {
    return (
      <ProfileErrorRecovery
        error={profileError || ""}
        hasTimedOut={false}
        onRetry={refreshProfile}
      />
    );
  }

  if (loading || isProfileLoading) {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Card>
          <CardHeader>
            <CardTitle>Profil wird geladen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-10 h-10 border-4 border-muted-foreground border-t-transparent rounded-full animate-spin mx-auto my-4"></div>
            <p className="text-center">Dein Profil wird geladen...</p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Dauert das zu lange? Die Seite wird automatisch eine Lösung anbieten.
            </p>
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

  return <>{children}</>;
}

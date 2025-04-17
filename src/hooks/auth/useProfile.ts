
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import type { UserProfile } from "@/types/auth";
import { isProfileIncomplete, getMissingProfileFields } from "@/utils/profile-check";

export function useProfile(user: User | null, isSessionLoading: boolean) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const userProfile = await authService.fetchUserProfile(userId);
      
      if (!userProfile) {
        console.warn("⚠️ Kein Benutzerprofil gefunden für:", userId);
        throw new Error("Benutzerprofil konnte nicht gefunden werden");
      }
      
      // Check profile completeness and notify user if incomplete
      if (userProfile.profile_complete !== true && isProfileIncomplete(userProfile)) {
        const missingFields = getMissingProfileFields(userProfile);
        if (missingFields.length > 0) {
          toast({
            title: "Profil unvollständig",
            description: `Bitte vervollständige dein Profil: ${missingFields.join(', ')} fehlen noch.`,
            variant: "default"
          });
        }
      }
      
      setProfile(userProfile);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler beim Laden des Profils";
      console.error("❌ Fehler beim Laden des Profils:", err);
      setError(new Error(message));
      
      // Limit toast notifications to prevent spam
      if (retryCount < 3) {
        toast({
          title: "Fehler",
          description: message,
          variant: "destructive"
        });
      }
      
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Manual retry function that resets retry count
  const retryProfileLoad = user ? () => {
    setRetryCount(0);
    return fetchProfile(user.id);
  } : null;

  useEffect(() => {
    if (isSessionLoading) return;

    if (user) {
      fetchProfile(user.id);
    } else {
      // Reset states on logout
      setProfile(null);
      setLoading(false);
      setError(null);
      setRetryCount(0);
    }
  }, [user, isSessionLoading]);

  return {
    profile,
    profileLoading: loading,
    profileError: error,
    setProfile,
    retryProfileLoad
  };
}

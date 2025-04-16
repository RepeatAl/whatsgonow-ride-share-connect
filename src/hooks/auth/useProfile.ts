import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import type { UserProfile } from "@/types/auth";

/**
 * Hook zur Verwaltung des Benutzerprofils
 */
export function useProfile(user: User | null, isSessionLoading: boolean) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Lädt das Benutzerprofil aus Supabase oder zeigt Fehler an
   */
  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const userProfile = await authService.fetchUserProfile(userId);
      setProfile(userProfile);

      if (!userProfile) {
        console.warn("⚠️ Kein Benutzerprofil gefunden für:", userId);
        throw new Error("Benutzerprofil konnte nicht gefunden werden");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler beim Laden des Profils";
      console.error("❌ Fehler beim Laden des Profils:", err);

      setError(new Error(message));
      toast({
        title: "Fehler",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Lade kein Profil während die Session noch initialisiert wird
    if (isSessionLoading) return;

    if (user) {
      fetchProfile(user.id);
    } else {
      // Reset bei Logout
      setProfile(null);
      setLoading(false);
    }
  }, [user, isSessionLoading]);

  return {
    profile,
    loading,
    error,
    setProfile,
    retry: user ? () => fetchProfile(user.id) : undefined
  };
}

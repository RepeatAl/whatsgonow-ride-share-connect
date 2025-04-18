
// src/hooks/auth/useProfile.ts
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/auth";
import { isProfileIncomplete } from "@/utils/profile-check";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log("🔄 Lade Profil für:", userId);
      setLoading(true);
      setError(null);

      const userProfile = await authService.fetchUserProfile(userId);

      if (!userProfile) {
        throw new Error("Profil konnte nicht geladen werden.");
      }

      setProfile(userProfile);
      setRetryCount(0);
    } catch (err) {
      console.error("❌ Fehler beim Laden des Profils:", err);
      const message = err instanceof Error ? err.message : "Unbekannter Fehler beim Laden";
      setError(new Error(message));

      if (retryCount < 2) {
        toast({
          title: "Fehler beim Laden des Profils",
          description: message,
          variant: "destructive"
        });
      }

      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [retryCount]);

  const retryProfileLoad = useCallback(() => {
    if (!user) return;
    console.log("🔁 Erneuter Profil-Ladeversuch");
    setRetryCount(0);
    fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    // Get the current user from Supabase
    const getUserAndFetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          fetchProfile(currentUser.id);
        } else {
          setLoading(false);
          setIsInitialLoad(false);
        }
      } catch (err) {
        console.error("Error getting user session:", err);
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    getUserAndFetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    retryProfileLoad,
    isInitialLoad,
    isProfileComplete: profile ? !isProfileIncomplete(profile) : false,
    user,
    refreshProfile: user ? () => fetchProfile(user.id) : null
  };
}

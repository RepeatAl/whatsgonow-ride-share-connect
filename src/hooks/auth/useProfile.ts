import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types/auth";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log("🔄 Loading profile for:", userId);
      setLoading(true);
      setError(null);

      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select(`
          user_id,
          name,
          email,
          phone,
          role,
          company_name,
          region,
          postal_code,
          city,
          street,
          house_number,
          address_extra,
          profile_complete,
          onboarding_complete
        `)
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!userProfile) {
        toast({
          title: "Kein Profil gefunden",
          description: "Bitte kontaktiere den Support.",
          variant: "destructive"
        });
        throw new Error("Profile konnte nicht geladen werden.");
      }

      setProfile(userProfile);
      setRetryCount(0);
      console.log("✅ Profile loaded:", userProfile);
    } catch (err) {
      console.error("❌ Error loading profile:", err);
      setError(err instanceof Error ? err : new Error("Unbekannter Fehler beim Laden des Profils"));
      
      if (retryCount < 2) {
        setRetryCount((prev) => prev + 1);
      }
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
    const getUserAndFetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          console.log("📥 Fetching profile for user:", currentUser.id);
          await fetchProfile(currentUser.id);
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
    user,
    refreshProfile: user ? () => fetchProfile(user.id) : null
  };
}

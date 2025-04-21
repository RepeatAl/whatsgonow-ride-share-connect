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
      setLoading(true);
      setError(null);

      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select(`
          user_id,
          email,
          first_name,
          last_name,
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

      if (profileError) {
        setProfile(null);
        setError(profileError);
        throw profileError;
      }

      if (!userProfile) {
        setProfile(null);
        setError(new Error("Kein Profil gefunden."));
        if (retryCount < 2) {
          setTimeout(() => {
            setRetryCount(count => count + 1);
          }, 1000);
        }
        return;
      }

      const transformedProfile: UserProfile = {
        ...userProfile,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'New User'
      };

      setProfile(transformedProfile);
      setRetryCount(0);
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err : new Error("Unknown error loading profile"));
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
    console.log("🔁 Retrying profile load");
    setRetryCount(0);
    fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          console.log("📥 Found session, fetching profile for:", currentUser.id);
          await fetchProfile(currentUser.id);
        } else {
          console.log("⚠️ No user session found");
          setLoading(false);
          setIsInitialLoad(false);
        }
      } catch (err) {
        console.error("Session init error:", err);
        if (mounted) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔐 Auth state changed:", event);
        if (!mounted) return;
        
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser && event === 'SIGNED_IN') {
          setTimeout(async () => {
            if (mounted) {
              await fetchProfile(currentUser.id);
            }
          }, 0);
        } else if (!currentUser) {
          setProfile(null);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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

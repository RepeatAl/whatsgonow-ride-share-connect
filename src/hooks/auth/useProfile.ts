
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
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }
      
      if (!userProfile) {
        console.log("No profile found, will be created by trigger");
        return;
      }

      setProfile(userProfile);
      setRetryCount(0);
      console.log("✅ Profile loaded:", userProfile);
    } catch (err) {
      console.error("❌ Error loading profile:", err);
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
          setLoading(false);
          setIsInitialLoad(false);
        }
      } catch (err) {
        console.error("Session init error:", err);
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔐 Auth state changed:", event);
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser && event === 'SIGNED_IN') {
          await fetchProfile(currentUser.id);
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

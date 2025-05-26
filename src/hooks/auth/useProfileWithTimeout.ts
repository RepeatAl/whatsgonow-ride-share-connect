
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

const PROFILE_FETCH_TIMEOUT = 5000; // 5 seconds

interface UseProfileWithTimeoutReturn {
  profile: UserProfile | null;
  isProfileLoading: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  hasTimedOut: boolean;
}

export function useProfileWithTimeout(user: User | null): UseProfileWithTimeoutReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    console.log("🔍 Fetching profile for user:", userId);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ Profile fetch error:", error);
      throw new Error(`Profile fetch failed: ${error.message}`);
    }

    if (!data) {
      console.warn("⚠️ No profile found for user:", userId);
      return null;
    }

    console.log("✅ Profile loaded successfully");
    return {
      ...data,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'New User'
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfileError(null);
      setHasTimedOut(false);
      return;
    }

    setIsProfileLoading(true);
    setProfileError(null);
    setHasTimedOut(false);

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          setHasTimedOut(true);
          reject(new Error('Profile loading timeout'));
        }, PROFILE_FETCH_TIMEOUT);
      });

      // Race between fetch and timeout
      const profileData = await Promise.race([
        fetchProfile(user.id),
        timeoutPromise
      ]);

      setProfile(profileData);
      setProfileError(null);
    } catch (error: any) {
      console.error("❌ Profile loading failed:", error);
      
      if (error.message.includes('timeout')) {
        setProfileError("Profil-Laden hat zu lange gedauert. Bitte versuche es erneut.");
        toast({
          title: "Timeout",
          description: "Profil konnte nicht geladen werden. Bitte versuche es erneut.",
          variant: "destructive",
        });
      } else {
        setProfileError("Profil konnte nicht geladen werden.");
        toast({
          title: "Profil-Fehler",
          description: "Bitte melde dich erneut an oder kontaktiere den Support.",
          variant: "destructive",
        });
      }
      
      setProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, [user, fetchProfile]);

  // Auto-fetch when user changes
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return {
    profile,
    isProfileLoading,
    profileError,
    refreshProfile,
    hasTimedOut
  };
}


import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/services/auth-service";
import type { UserProfile } from "@/types/auth";

export function useProfile(user: User | null, isSessionLoading: boolean) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userProfile = await authService.fetchUserProfile(userId);
      setProfile(userProfile);
      
      if (!userProfile) {
        console.warn("⚠️ No user profile found for:", userId);
        setError(new Error("Benutzerprofil konnte nicht gefunden werden"));
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError(err instanceof Error ? err : new Error("Fehler beim Laden des Profils"));
      toast({
        title: "Fehler",
        description: "Benutzerprofil konnte nicht geladen werden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Don't try to fetch profile if session is still loading
    if (isSessionLoading) return;
    
    // If user exists, fetch profile
    if (user) {
      fetchProfile(user.id);
    } else {
      // Reset profile when user is null (logged out)
      setProfile(null);
      setLoading(false);
    }
  }, [user, isSessionLoading]);

  return { 
    profile, 
    profileLoading: loading, 
    profileError: error, 
    setProfile,
    retryProfileLoad: user ? () => fetchProfile(user.id) : null
  };
}

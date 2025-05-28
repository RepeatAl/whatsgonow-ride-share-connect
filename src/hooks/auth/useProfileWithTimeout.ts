
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types/auth";

const PROFILE_TIMEOUT = 10000; // 10 seconds

export function useProfileWithTimeout(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // PHASE 2 FIX: Debounced and stabilized profile fetching
  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsProfileLoading(false);
      setProfileError(null);
      setHasTimedOut(false);
      setProfileLoaded(false);
      return;
    }

    // PHASE 2 FIX: Don't fetch if already loaded for this user
    if (profileLoaded && profile?.user_id === user.id) {
      console.debug("🔄 Profile already loaded for user:", user.id);
      return;
    }
    
    try {
      setIsProfileLoading(true);
      setProfileError(null);
      setHasTimedOut(false);
      
      console.debug("🔄 Fetching profile for user:", user.id);
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        console.error("⏰ Profile loading timeout");
        setHasTimedOut(true);
        setProfileError("Profile loading timeout - please try again");
        setIsProfileLoading(false);
      }, PROFILE_TIMEOUT);

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
          onboarding_complete,
          name_affix,
          avatar_url,
          verified,
          can_become_driver,
          dashboard_access_enabled,
          wants_to_upload_items,
          is_suspended,
          suspended_until,
          suspension_reason
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      // Clear timeout if request completes
      clearTimeout(timeoutId);

      if (profileError) {
        console.error("❌ Profile fetch error:", profileError);
        throw profileError;
      }

      if (userProfile) {
        const transformedProfile: UserProfile = {
          ...userProfile,
          name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'New User'
        };
        
        setProfile(transformedProfile);
        setProfileLoaded(true);
        console.debug("✅ Profile loaded successfully:", transformedProfile.role);
      } else {
        console.warn("⚠️ No profile found for user", user.id);
        setProfile(null);
        setProfileError("No profile found - please contact support");
        setProfileLoaded(false);
      }
      
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      setProfileError((error as Error).message || "Failed to load profile");
      setProfileLoaded(false);
    } finally {
      setIsProfileLoading(false);
    }
  }, [user, profile?.user_id, profileLoaded]);

  const refreshProfile = useCallback(async () => {
    console.debug("🔄 Refreshing profile...");
    setProfileLoaded(false); // Force reload
    await fetchUserProfile();
  }, [fetchUserProfile]);

  // PHASE 2 FIX: Only fetch profile when user changes and auth is stable
  useEffect(() => {
    // Reset profile state when user changes
    if (!user) {
      setProfile(null);
      setProfileLoaded(false);
      setProfileError(null);
      setHasTimedOut(false);
      return;
    }

    // Only fetch if we don't have a profile for this specific user
    if (!profileLoaded || profile?.user_id !== user.id) {
      console.debug("🔄 User changed or profile not loaded, fetching...", { 
        userId: user.id, 
        profileLoaded, 
        currentProfileUserId: profile?.user_id 
      });
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile, profileLoaded, profile?.user_id]);

  return {
    profile,
    isProfileLoading,
    profileError,
    refreshProfile,
    hasTimedOut
  };
}

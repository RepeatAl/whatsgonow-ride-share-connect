
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

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsProfileLoading(false);
      setProfileError(null);
      setHasTimedOut(false);
      return;
    }
    
    try {
      setIsProfileLoading(true);
      setProfileError(null);
      setHasTimedOut(false);
      
      console.log("🔄 Fetching profile for user:", user.id);
      
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
        console.log("✅ Profile loaded successfully:", transformedProfile.role);
      } else {
        console.warn("⚠️ No profile found for user", user.id);
        setProfile(null);
        setProfileError("No profile found - please contact support");
      }
      
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      setProfileError((error as Error).message || "Failed to load profile");
    } finally {
      setIsProfileLoading(false);
    }
  }, [user]);

  const refreshProfile = useCallback(async () => {
    console.log("🔄 Refreshing profile...");
    await fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    profile,
    isProfileLoading,
    profileError,
    refreshProfile,
    hasTimedOut
  };
}

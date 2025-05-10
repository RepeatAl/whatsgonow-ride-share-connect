
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types/auth";
import { fetchUserRegion } from "@/utils/regionUtils";

/**
 * Hook to handle user profile fetching and management
 */
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [isTest, setIsTest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to check if a region is a test region
  const isTestRegion = (region: string | null | undefined): boolean => {
    const TEST_REGION_PREFIXES = ["test", "us-ca", "us-ny", "uk-ldn"];
    return region ? TEST_REGION_PREFIXES.some(prefix => 
      region.toLowerCase().startsWith(prefix)
    ) : false;
  };

  // Function to fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setRegion(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profile data
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
          wants_to_upload_items
        `)
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (userProfile) {
        const transformedProfile: UserProfile = {
          ...userProfile,
          name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'New User'
        };
        
        setProfile(transformedProfile);
        setRegion(transformedProfile.region || null);
        console.log("✅ Profile loaded successfully");
      } else {
        console.warn("⚠️ Kein Profil gefunden für User", user.id);
        setProfile(null);
      }

      // Check if region is a test region
      const userRegion = await fetchUserRegion(supabase, user.id);
      setRegion(userRegion);
      setIsTest(isTestRegion(userRegion));
      
    } catch (error) {
      console.error("❌ Error loading profile:", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load profile when user changes
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    profile,
    region,
    isTest,
    loading,
    error,
    refreshProfile: fetchUserProfile
  };
}


import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types/auth";

/**
 * Hook to handle user profile fetching and management
 * Updated to work with new cm_regions structure
 * 
 * SECURITY NOTE: This hook implements a critical security check that ensures 
 * authenticated users without profiles cannot access protected routes.
 * When a user has a valid session but no corresponding profile in the database,
 * this hook sets profile to null, which triggers the security redirect in ProfileCheck.tsx.
 */
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [isTest, setIsTest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to check if a region is a test region
  const isTestRegion = (regionName: string | null | undefined): boolean => {
    const TEST_REGION_PREFIXES = ["test", "us-ca", "us-ny", "uk-ldn"];
    return regionName ? TEST_REGION_PREFIXES.some(prefix => 
      regionName.toLowerCase().startsWith(prefix)
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
      
      // Fetch profile data with region information
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
          region_id,
          cm_regions(
            region_name,
            country_code,
            state_province,
            city_name
          )
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
        
        // Set region from new cm_regions structure - properly handle array access
        let regionName: string | null = null;
        
        if (userProfile.cm_regions) {
          if (Array.isArray(userProfile.cm_regions) && userProfile.cm_regions.length > 0) {
            regionName = userProfile.cm_regions[0]?.region_name || null;
          } else if (!Array.isArray(userProfile.cm_regions)) {
            regionName = userProfile.cm_regions.region_name || null;
          }
        }
        
        // Fallback to legacy region field
        if (!regionName) {
          regionName = userProfile.region || null;
        }
        
        setRegion(regionName);
        setIsTest(isTestRegion(regionName));
        
        console.log("✅ Profile loaded successfully with region:", regionName);
      } else {
        // SECURITY NOTE: Critical to set profile to null when no profile exists
        // This triggers the security redirect in ProfileCheck.tsx
        console.warn("⚠️ Kein Profil gefunden für User", user.id);
        setProfile(null);
      }
      
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

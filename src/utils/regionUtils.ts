
/**
 * Region utility functions for Whatsgonow
 */

// Utility function to check if a region is a test region
export const isTestRegion = (region: string | null | undefined): boolean => {
  const TEST_REGION_PREFIXES = ["test", "us-ca", "us-ny", "uk-ldn"];
  return region ? TEST_REGION_PREFIXES.some(prefix => 
    region.toLowerCase().startsWith(prefix)
  ) : false;
};

// Function to fetch user region from Supabase
export const fetchUserRegion = async (supabase: any, userId: string): Promise<string | null> => {
  const { data: profile, error } = await supabase
    .from("users")
    .select("region")
    .eq("user_id", userId)
    .single();

  if (error || !profile) {
    console.error("Failed to load region", error);
    return null;
  }
  
  return profile.region;
};


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
  try {
    const { data, error } = await supabase
      .from('user_regions')
      .select('region')
      .eq('user_id', userId)  // Updated from 'id' to 'user_id'
      .single();

    if (error) {
      console.error("Failed to load region:", error);
      return null;
    }
    
    // Return the region data if available, otherwise null
    return data?.region || null;
  } catch (error) {
    console.error("Unexpected error loading region:", error);
    return null;
  }
};

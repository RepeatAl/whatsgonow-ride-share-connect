
/**
 * Region utility functions for Whatsgonow
 * Updated to work with new cm_regions structure (international-ready)
 */

import { supabase } from "@/lib/supabaseClient";

// Updated interface for new cm_regions structure
export interface CMRegion {
  region_id: string;
  region_name: string;
  country_code?: string;
  plz_range_min?: string;
  plz_range_max?: string;
  state_province?: string;
  city_name?: string;
  region_polygon?: any;
  cm_user_id?: string;
  active: boolean;
}

// Utility function to check if a region is a test region
export const isTestRegion = (region: string | null | undefined): boolean => {
  const TEST_REGION_PREFIXES = ["test", "us-ca", "us-ny", "uk-ldn"];
  return region ? TEST_REGION_PREFIXES.some(prefix => 
    region.toLowerCase().startsWith(prefix)
  ) : false;
};

// Function to fetch user region from new cm_regions structure
export const fetchUserRegion = async (supabase: any, userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        region_id,
        cm_regions!inner(
          region_name,
          country_code,
          state_province,
          city_name
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Failed to load region:", error);
      return null;
    }
    
    // Return the region name if available, otherwise null
    return data?.cm_regions?.region_name || null;
  } catch (error) {
    console.error("Unexpected error loading region:", error);
    return null;
  }
};

// Function to get all active regions
export const fetchAllRegions = async (): Promise<CMRegion[]> => {
  try {
    const { data, error } = await supabase
      .from('cm_regions')
      .select('*')
      .eq('active', true)
      .order('region_name');

    if (error) {
      console.error("Failed to load regions:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Unexpected error loading regions:", error);
    return [];
  }
};

// Function to find region by postal code
export const findRegionByPostalCode = async (postalCode: string, countryCode: string = 'DE'): Promise<CMRegion | null> => {
  try {
    const { data, error } = await supabase
      .from('cm_regions')
      .select('*')
      .eq('country_code', countryCode)
      .eq('active', true)
      .or(`plz_range_min.lte.${postalCode},plz_range_min.is.null`)
      .or(`plz_range_max.gte.${postalCode},plz_range_max.is.null`)
      .limit(1);

    if (error) {
      console.error("Failed to find region by postal code:", error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Unexpected error finding region:", error);
    return null;
  }
};

// Function to get region display name (with country/state context)
export const getRegionDisplayName = (region: CMRegion): string => {
  if (!region) return 'Unknown Region';
  
  let displayName = region.region_name;
  
  // Add city context if different from region name
  if (region.city_name && !displayName.includes(region.city_name)) {
    displayName = `${region.city_name} - ${displayName}`;
  }
  
  // Add state/province context for international clarity
  if (region.state_province) {
    displayName += ` (${region.state_province})`;
  }
  
  // Add country code for international regions
  if (region.country_code && region.country_code !== 'DE') {
    displayName += ` [${region.country_code}]`;
  }
  
  return displayName;
};

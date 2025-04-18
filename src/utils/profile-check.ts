
import type { UserProfile } from "@/types/auth";

/**
 * Check if a profile is incomplete based on missing required fields
 * @param profile User profile to check
 * @returns true if profile is incomplete, false otherwise
 */
export const isProfileIncomplete = (profile: UserProfile | null): boolean => {
  if (!profile) return true;
  
  const requiredFields = [
    "name",
    "email", 
    "phone", 
    "postal_code", 
    "city", 
    "region"
  ];
  
  return requiredFields.some(field => {
    // @ts-ignore - dynamic property access
    const value = profile[field];
    return !value || value.trim() === "";
  });
};

/**
 * Get a list of missing fields in a user profile
 * @param profile User profile to check
 * @returns Array of field names that are missing values
 */
export const getMissingProfileFields = (profile: UserProfile | null): string[] => {
  if (!profile) return ["Alle Angaben"];
  
  const fieldLabels: Record<string, string> = {
    name: "Name",
    email: "E-Mail", 
    phone: "Telefonnummer", 
    postal_code: "Postleitzahl", 
    city: "Stadt", 
    region: "Region"
  };
  
  return Object.entries(fieldLabels)
    .filter(([key]) => {
      // @ts-ignore - dynamic property access
      const value = profile[key];
      return !value || value.trim() === "";
    })
    .map(([_, label]) => label);
};

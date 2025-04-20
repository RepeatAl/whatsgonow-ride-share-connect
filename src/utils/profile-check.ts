
import type { UserProfile } from "@/types/auth";

export const isProfileIncomplete = (profile: UserProfile | null): boolean => {
  if (!profile) return true;
  
  const requiredFields = [
    "first_name",
    "last_name",
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

export const getMissingProfileFields = (profile: UserProfile | null): string[] => {
  if (!profile) return ["Alle Angaben"];
  
  const fieldLabels: Record<string, string> = {
    first_name: "Vorname",
    last_name: "Nachname",
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

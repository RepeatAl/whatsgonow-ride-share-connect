
import type { UserProfile } from "@/types/auth";

export const isProfileIncomplete = (profile: UserProfile | null): boolean => {
  if (!profile) return true;
  
  // Wenn das Profil explizit als vollständig markiert ist, vertrauen wir diesem Flag
  if (profile.profile_complete === true) return false;
  
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
    return !value || (typeof value === 'string' && value.trim() === "");
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
      return !value || (typeof value === 'string' && value.trim() === "");
    })
    .map(([_, label]) => label);
};

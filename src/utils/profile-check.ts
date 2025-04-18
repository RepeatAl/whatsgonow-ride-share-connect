import type { UserProfile } from "@/types/auth";

/**
 * Prüft, ob ein Nutzerprofil unvollständig ist
 */
export const isProfileIncomplete = (user: UserProfile | null): boolean => {
  if (!user) return true;

  if (user.profile_complete === true) return false;

  const requiredFields: (keyof UserProfile)[] = [
    "name",
    "email",
    "phone",
    "region",
    "postal_code",
    "city"
  ];

  if (user.role === "sender_business") {
    requiredFields.push("company_name");
  }

  for (const field of requiredFields) {
    const value = user[field];
    if (!value || typeof value === "string" && value.trim() === "") {
      return true;
    }
  }

  if (user.street && !user.house_number) {
    return true;
  }

  return false;
};

/**
 * Gibt eine Liste aller fehlenden Pflichtfelder für das Profil zurück
 */
export const getMissingProfileFields = (user: UserProfile | null): string[] => {
  if (!user) return ["alle Felder"];

  const missing: string[] = [];

  if (!user.name) missing.push("Name");
  if (!user.email) missing.push("E-Mail");
  if (!user.phone) missing.push("Telefonnummer");
  if (!user.region) missing.push("Region");
  if (!user.postal_code) missing.push("Postleitzahl");
  if (!user.city) missing.push("Stadt");

  if (user.role === "sender_business" && !user.company_name) {
    missing.push("Firmenname");
  }

  if (user.street && !user.house_number) {
    missing.push("Hausnummer (wenn Straße angegeben)");
  }

  return missing;
};

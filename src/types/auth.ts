import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  active?: boolean;
  company_name?: string;
  profile_complete?: boolean;
  onboarding_complete?: boolean;
  phone?: string;
  postal_code?: string;
  city?: string;
  street?: string;
  house_number?: string;
  address_extra?: string;
  name_affix?: string;
  verified?: boolean;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  can_become_driver?: boolean;
  dashboard_access_enabled?: boolean;
  wants_to_upload_items?: boolean;
  id_photo_url?: string;           // Added missing property
  id_photo_verified?: boolean;     // Added missing property
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isInitialLoad: boolean;
  isProfileComplete?: boolean;
  sessionExpired?: boolean;
  // Aktualisieren der signIn-Signatur, um mit UserSessionContext konsistent zu sein
  signIn: (email: string, password: string) => Promise<any>; // Geändert zu Promise<any>
  signUp: (
    email: string,
    password: string,
    metadata?: {
      first_name?: string;
      last_name?: string;
      name_affix?: string;
      phone?: string;
      region?: string;
      postal_code?: string;
      city?: string;
      street?: string;
      house_number?: string;
      address_extra?: string;
      role?: string;
      company_name?: string;
    }
  ) => Promise<{ user: User | null; session: Session | null } | void>;
  signOut: () => Promise<void>;
  retryProfileLoad: (() => void) | null;
  refreshProfile?: (() => void) | null;
}

// Updated to follow the conventions from /docs/conventions/roles_and_ids.md
export type UserRole =
  | "sender_private"
  | "sender_business"
  | "driver"
  | "cm"
  | "admin"
  | "super_admin";

// Super admin ID (should be in an env variable in production)
export const SUPER_ADMIN_ID = "0ddb52f9-0e7a-4c53-8ae7-fca1209cd300";

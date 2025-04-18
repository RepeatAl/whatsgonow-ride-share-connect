// ✅ Vollständig aktualisierte auth.ts – inkl. neuer Felder
import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region: string;
  phone: string;
  postal_code: string;
  city: string;
  street?: string;
  house_number?: string;
  address_extra?: string;
  name_affix?: string;
  company_name?: string;
  profile_complete?: boolean;
  onboarding_complete?: boolean;
  active?: boolean;
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isInitialLoad: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    metadata?: Partial<UserProfile>
  ) => Promise<{ user: User | null; session: Session | null } | void>;
  signOut: () => Promise<void>;
  retryProfileLoad: (() => void) | null;
}

export type UserRole =
  | "sender_private"
  | "sender_business"
  | "driver"
  | "cm"
  | "admin"
  | "admin_limited";

// Super admin ID (should be in an env variable in production)
export const SUPER_ADMIN_ID = "0ddb52f9-0e7a-4c53-8ae7-fca1209cd300";

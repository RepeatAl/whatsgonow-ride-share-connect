
import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  active?: boolean;
  company_name?: string;
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isInitialLoad: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { 
    name?: string;
    role?: string;
    company_name?: string;
  }) => Promise<{user: User | null; session: Session | null} | void>;
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

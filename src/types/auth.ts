
import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  active?: boolean;
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { 
    name?: string;
    role?: string;
    company_name?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

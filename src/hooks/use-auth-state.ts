
import { useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  return {
    user,
    setUser,
    session,
    setSession,
    profile,
    setProfile,
    loading,
    setLoading,
  };
}

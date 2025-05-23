import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    console.log("🔄 useAuthState initialized");

    // Initial Session Fetch
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error("❌ Fehler beim Laden der Sitzung:", error);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    });

    // Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        console.log("📡 Auth event:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

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

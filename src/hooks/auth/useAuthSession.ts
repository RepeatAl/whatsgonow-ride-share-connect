import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

/**
 * Hook zur Verwaltung von Authentifizierungs-Session und Benutzerstatus
 */
export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("🔄 useAuthSession: Initializing...");

    // Auth-Änderungen überwachen
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("🔑 Auth event:", event);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    // Aktuelle Session einmalig beim Mount holen
    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (sessionError) {
          console.error("❌ Fehler beim Abrufen der Session:", sessionError);
          setError(sessionError);
        }

        setSession(data.session);
        setUser(data.session?.user ?? null);
        console.log("✅ Aktuelle Session geladen:", !!data.session?.user);
      })
      .catch((err) => {
        console.error("❌ Unerwarteter Fehler bei Session-Init:", err);
        setError(err instanceof Error ? err : new Error("Unbekannter Fehler bei Session"));
      })
      .finally(() => {
        setLoading(false);
      });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    error,
    setUser,
    setSession,
  };
}

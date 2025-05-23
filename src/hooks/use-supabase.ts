
// ❌ VERALTET – Nicht mehr verwenden. Ersetzt durch AuthContext-System.

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

// Use the client from the correct location
import { getSupabaseClient } from "@/lib/supabaseClient";

export type { User } from "@supabase/supabase-js";

interface UseSupabaseReturn {
  supabase: typeof getSupabaseClient;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// This hook is kept for backward compatibility
// New components should use the AuthContext instead
export function useSupabase(): UseSupabaseReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Bereinige lokalen Auth-Zustand vor dem Abmelden
      cleanupAuthState();
      
      // Führe den tatsächlichen Abmeldevorgang durch
      await supabase.auth.signOut({
        scope: 'global' // Alle Sessions abmelden (nicht nur die aktuelle)
      });
      
      toast({
        title: "Abgemeldet",
        description: "Du wurdest erfolgreich abgemeldet.",
      });
      
      // Force reload für einen sauberen Zustand
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Fehler beim Abmelden",
        description: `${(error as Error).message}`,
        variant: "destructive",
      });
      
      // Im Fehlerfall trotzdem versuchen, den lokalen Zustand zu bereinigen
      cleanupAuthState();
    }
  };

  // Hilfsfunktion zum Bereinigen aller Auth-related Items aus localStorage/sessionStorage
  const cleanupAuthState = () => {
    if (typeof window === 'undefined') return; // Skip in non-browser environment
    
    try {
      // Entferne standard auth tokens
      localStorage.removeItem('supabase.auth.token');
      
      // Entferne alle Supabase auth keys aus localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Entferne aus sessionStorage falls verwendet
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error("Error cleaning up auth state:", e);
      // Non-critical error, continue execution
    }
  };

  return {
    supabase: getSupabaseClient,
    user,
    loading,
    signOut,
  };
}

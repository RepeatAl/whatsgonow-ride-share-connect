
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

// Use the client from the correct location
import { supabase } from "@/integrations/supabase/client";

export type { User } from "@supabase/supabase-js";

interface UseSupabaseReturn {
  supabase: typeof supabase;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// This hook is kept for backward compatibility
// New components should use the AuthContext instead
export function useSupabase(): UseSupabaseReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      await supabase.auth.signOut();
      toast({
        title: "Abgemeldet",
        description: "Du wurdest erfolgreich abgemeldet.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Fehler beim Abmelden",
        description: `${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };

  return {
    supabase,
    user,
    loading,
    signOut,
  };
}

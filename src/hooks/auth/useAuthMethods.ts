
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/**
 * Hook that provides authentication methods (sign in, sign up, sign out)
 */
export function useAuthMethods() {
  const [authError, setAuthError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      setAuthError(err);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: err?.message || "Bitte überprüfe deine E-Mail-Adresse und dein Passwort.",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Sign up with email, password and optional metadata
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Bestätige deine E‑Mail-Adresse, um fortzufahren."
      });

      return data;
    } catch (err: any) {
      setAuthError(err);
      toast({
        title: "Registrierung fehlgeschlagen",
        description: err?.message || "Bitte versuche es später erneut.",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/", { replace: true });
    } catch (error: any) {
      setAuthError(error);
      toast({
        title: "Fehler beim Abmelden",
        description: error?.message || "Bitte versuche es später erneut.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    authError
  };
}

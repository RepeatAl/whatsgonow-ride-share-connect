
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/**
 * Hook that provides authentication methods (sign in, sign up, sign out)
 * Optimiert für Kompatibilität mit aktueller Supabase JS SDK
 */
export function useAuthMethods() {
  const supabase = getSupabaseClient();
  const [authError, setAuthError] = useState<Error | null>(null);
  const navigate = useNavigate();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Sicherheitsmaßnahme: Token im localStorage aktualisieren
      if (data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      }
      
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

  // Sign out - optimiert mit besserer Fehlerbehandlung und lokaler Speicherbereinigung
  const signOut = async () => {
    try {
      // Bereinige erst lokalen Speicher
      cleanupAuthState();
      
      // Dann führe den Supabase-Logout durch
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Alle Sessions abmelden (nicht nur die aktuelle)
      });
      
      if (error) throw error;
      
      navigate("/", { replace: true });
    } catch (error: any) {
      setAuthError(error);
      toast({
        title: "Fehler beim Abmelden",
        description: error?.message || "Bitte versuche es später erneut.",
        variant: "destructive"
      });
      
      // Im Fehlerfall forciert zum Login weiterleiten
      window.location.href = "/login";
      throw error;
    }
  };

  // Hilfsfunktion zum Bereinigen aller Auth-related Items aus localStorage/sessionStorage
  const cleanupAuthState = () => {
    // Entferne standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Entferne alle Supabase auth keys aus localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Entferne aus sessionStorage falls verwendet
    try {
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      // Ignoriere Fehler in Node.js-Umgebung, wo sessionStorage nicht existiert
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    authError,
    cleanupAuthState
  };
}

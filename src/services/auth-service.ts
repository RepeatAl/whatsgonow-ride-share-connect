
import { supabase } from "@/integrations/supabase/client";
import { handleAuthError } from "@/utils/auth-utils";

export const authService = {
  async fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (error) {
        console.error("Fehler beim Laden des Benutzerprofils:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Exception beim Laden des Benutzerprofils:", error);
      return null;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as Error, "Anmeldung");
    }
  },

  async signUp(email: string, password: string, metadata?: { 
    name?: string;
    role?: string;
    company_name?: string;
  }) {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (error) throw error;

      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erstellt. Bitte überprüfe deine E-Mails für die Bestätigung."
      });
    } catch (error) {
      handleAuthError(error as Error, "Registrierung");
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      handleAuthError(error as Error, "Abmeldung");
    }
  }
};

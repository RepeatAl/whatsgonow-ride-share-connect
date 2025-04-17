import { supabase } from "@/lib/supabaseClient";
import { handleAuthError } from "@/utils/auth-utils";
import { toast } from "@/components/ui/use-toast";

export const authService = {
  // Verbesserte Version mit zusätzlicher Fehlerbehandlung und logging
  async fetchUserProfile(userId: string) {
    try {
      console.log("📊 Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (error) {
        console.error("❌ Error fetching user profile:", error);
        
        // Wenn Profil nicht gefunden wurde, versuchen ein neues zu erstellen
        if (error.code === 'PGRST116') {
          console.log("🔄 Profile not found, attempting to create one");
          return await authService.createDefaultUserProfile(userId);
        }
        
        return null;
      }
      
      console.log("✅ User profile loaded successfully");
      return data;
    } catch (error) {
      console.error("❌ Exception when loading user profile:", error);
      return null;
    }
  },
  
  // Neue Methode, um ein Standardprofil zu erstellen, wenn keines existiert
  async createDefaultUserProfile(userId: string) {
    try {
      console.log("🆕 Creating default profile for user:", userId);
      
      // Benutzer-Email Adresse holen
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Error getting user data:", userError);
        return null;
      }
      
      const userEmail = userData?.user?.email || 'no-email';
      
      // Neuen Eintrag in der users-Tabelle erstellen
      const { data, error } = await supabase
        .from("users")
        .insert([
          { 
            user_id: userId,
            name: "Neuer Benutzer",
            email: userEmail,
            role: "sender_private",
            active: true
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error("❌ Error creating default user profile:", error);
        return null;
      }
      
      console.log("✅ Default profile created successfully:", data);
      toast({
        title: "Profil erstellt",
        description: "Ein Standardprofil wurde für dich angelegt. Bitte vervollständige deine Daten im Profil-Bereich."
      });
      
      return data;
    } catch (error) {
      console.error("❌ Exception when creating default user profile:", error);
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
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
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

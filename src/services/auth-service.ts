
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
      console.log("🔑 Attempting sign in for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("❌ Sign in error:", error);
        throw error;
      }
      
      console.log("✅ Sign in successful");
      return data;
    } catch (error) {
      handleAuthError(error as Error, "Anmeldung");
      throw error;
    }
  },

  async signUp(email: string, password: string, metadata?: { 
    name?: string;
    role?: string;
    company_name?: string;
  }) {
    try {
      console.log("🔐 Attempting sign up for:", email, "with metadata:", metadata);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("❌ Sign up error:", error);
        throw error;
      }

      console.log("✅ Sign up successful:", data);
      toast({
        title: "Registrierung erfolgreich",
        description: "Dein Konto wurde erstellt. Bitte überprüfe deine E-Mails für die Bestätigung."
      });
      
      return data;
    } catch (error) {
      handleAuthError(error as Error, "Registrierung");
      throw error;
    }
  },

  async signOut() {
    try {
      console.log("🚪 Attempting sign out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Sign out error:", error);
        throw error;
      }
      
      console.log("✅ Sign out successful");
    } catch (error) {
      handleAuthError(error as Error, "Abmeldung");
      throw error;
    }
  }
};

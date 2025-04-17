import { supabase } from "@/lib/supabaseClient";
import { handleAuthError } from "@/utils/auth-utils";
import { toast } from "@/components/ui/use-toast";
import { getMissingProfileFields } from "@/utils/profile-check";

export const authService = {
  // Improved user profile fetching with better error handling and logging
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
        
        // If profile not found, attempt to create a default one
        if (error.code === 'PGRST116') {
          console.log("🔄 Profile not found, attempting to create one");
          return await authService.createDefaultUserProfile(userId);
        }
        
        throw error;
      }
      
      console.log("✅ User profile loaded successfully");
      return data;
    } catch (error) {
      console.error("❌ Exception when loading user profile:", error);
      throw error;
    }
  },
  
  // Enhanced method to create a default profile with better data handling
  async createDefaultUserProfile(userId: string) {
    try {
      console.log("🆕 Creating default profile for user:", userId);
      
      // Get user email and metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Error getting user data:", userError);
        throw userError;
      }
      
      const user = userData?.user;
      const userEmail = user?.email || 'no-email';
      
      // Extract any available metadata
      const metadata = user?.user_metadata || {};
      const userName = metadata.name || "Neuer Benutzer";
      const userRole = metadata.role || "sender_private";
      const companyName = userRole === 'sender_business' ? metadata.company_name : null;
      const userRegion = metadata.region || null;
      
      // Create new entry in users table
      const { data, error } = await supabase
        .from("users")
        .insert([
          { 
            user_id: userId,
            name: userName,
            email: userEmail,
            role: userRole,
            company_name: companyName,
            region: userRegion,
            active: true,
            profile_complete: false
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error("❌ Error creating default user profile:", error);
        throw error;
      }
      
      // Get missing fields to inform the user
      const missingFields = getMissingProfileFields(data);
      const missingFieldsText = missingFields.length > 0 
        ? `Fehlende Felder: ${missingFields.join(', ')}`
        : '';
      
      console.log("✅ Default profile created successfully:", data);
      toast({
        title: "Profil erstellt",
        description: `Ein Standardprofil wurde für dich angelegt. ${missingFieldsText} Bitte vervollständige deine Daten im Profil-Bereich.`
      });
      
      return data;
    } catch (error) {
      console.error("❌ Exception when creating default user profile:", error);
      toast({
        title: "Fehler beim Erstellen des Profils",
        description: `Ein Fehler ist aufgetreten: ${(error as Error).message}`,
        variant: "destructive"
      });
      throw error;
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

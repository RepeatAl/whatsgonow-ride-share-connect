
// src/services/auth-service.ts
import { getSupabaseClient } from "@/lib/supabaseClient";
import { handleAuthError } from "@/utils/auth-utils";
import { toast } from "@/hooks/use-toast";
import { getMissingProfileFields } from "@/utils/profile-check";
import type { UserProfile } from "@/types/auth";

// Zugriff auf den Supabase-Client über die getSupabaseClient-Methode
const supabase = getSupabaseClient();

export const authService = {
  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log("📊 Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          user_id,
          first_name,
          last_name,
          name_affix,
          email,
          phone,
          role,
          company_name,
          region,
          postal_code,
          city,
          street,
          house_number,
          address_extra,
          profile_complete,
          onboarding_complete,
          created_at,
          updated_at,
          avatar_url,
          verified,
          can_become_driver,
          dashboard_access_enabled,
          wants_to_upload_items
        `)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        console.log("⚠️ No profile found, creating default...");
        return await this.createDefaultUserProfile(userId);
      }

      const profile = {
        ...data,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'New User'
      };

      console.log("✅ Profile loaded:", profile);
      return profile;
    } catch (error) {
      console.error("❌ Profile fetch failed:", error);
      throw error;
    }
  },

  async createDefaultUserProfile(userId: string): Promise<UserProfile> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const user = userData?.user;
      const email = user?.email ?? "no-email";
      const meta = user?.user_metadata ?? {};

      const insertData = {
        user_id: userId,
        email,
        first_name: meta.first_name || "",
        last_name: meta.last_name || "",
        name_affix: meta.name_affix || null,
        phone: meta.phone || "",
        role: meta.role || "sender_private",
        company_name: meta.company_name || null,
        region: meta.region || "",
        postal_code: meta.postal_code || "",
        city: meta.city || "",
        street: meta.street || null,
        house_number: meta.house_number || null,
        address_extra: meta.address_extra || null,
        profile_complete: false,
        onboarding_complete: false,
        avatar_url: null,
        verified: false,
        can_become_driver: false,
        dashboard_access_enabled: true,
        wants_to_upload_items: false
      };

      const { data, error } = await supabase
        .from("profiles")
        .insert([insertData])
        .select()
        .single();
      if (error) throw error;

      const missingFields = getMissingProfileFields(data);
      toast({
        title: "Profil erstellt",
        description: `Ein Standardprofil wurde angelegt. Bitte ergänze noch: ${missingFields.join(", ")}.`
      });
      return {
        ...data,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'New User'
      };
    } catch (error) {
      toast({
        title: "Fehler beim Erstellen des Profils",
        description: (error as Error).message,
        variant: "destructive"
      });
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      // Clean up existing state before sign in
      this.cleanupAuthState();
      
      console.log("🔐 Attempting sign in for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      console.log("✅ Sign in successful");
      return data;
    } catch (error) {
      handleAuthError(error as Error, "Anmeldung");
      throw error;
    }
  },

  async signUp(
    email: string,
    password: string,
    metadata?: {
      first_name?: string;
      last_name?: string;
      name_affix?: string;
      phone?: string;
      region?: string;
      postal_code?: string;
      city?: string;
      street?: string;
      house_number?: string;
      address_extra?: string;
      role?: string;
      company_name?: string;
    }
  ) {
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
      
      if (error) throw error;

      if (data.user && !data.session) {
        toast({
          title: "Registrierung erfolgreich",
          description: "Bitte bestätige deine E-Mail-Adresse, um fortzufahren.",
        });
      } else {
        toast({
          title: "Registrierung erfolgreich",
          description: "Willkommen bei Whatsgonow!",
        });
      }

      return data;
    } catch (error) {
      handleAuthError(error as Error, "Registrierung");
      throw error;
    }
  },

  async signOut() {
    try {
      console.log("🚪 Signing out...");
      
      // Bereinigung des lokalen Speicherzustands
      this.cleanupAuthState();

      // Global signOut für alle Geräte/Sitzungen
      const { error } = await supabase.auth.signOut({
        scope: 'global' 
      });
      
      if (error) throw error;
      console.log("✅ Sign out successful");
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/de';
      }, 100);
      
    } catch (error) {
      handleAuthError(error as Error, "Abmeldung");
      throw error;
    }
  },

  // Hilfsfunktion zum Bereinigen aller Auth-related Items aus localStorage/sessionStorage
  cleanupAuthState() {
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
  }
};

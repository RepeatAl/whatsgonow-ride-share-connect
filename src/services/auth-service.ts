// src/services/auth-service.ts
import { supabase } from "@/lib/supabaseClient";
import { handleAuthError } from "@/utils/auth-utils";
import { toast } from "@/components/ui/use-toast";
import { getMissingProfileFields } from "@/utils/profile-check";
import type { UserProfile } from "@/types/auth";

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
          updated_at
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
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
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
        name: `${meta.first_name ?? ""} ${meta.last_name ?? ""}`.trim() || meta.name || "Neuer Benutzer",
        name_affix: meta.name_affix || null,
        phone: meta.phone || null,
        role: meta.role || "sender_private",
        company_name: meta.company_name || null,
        region: meta.region || null,
        postal_code: meta.postal_code || null,
        city: meta.city || null,
        street: meta.street || null,
        house_number: meta.house_number || null,
        address_extra: meta.address_extra || null,
        profile_complete: false,
        onboarding_complete: false,
        avatar_url: null,
        verified: false
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
      return data;
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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

      toast({
        title: "Registrierung erfolgreich",
        description: "Bestätige deine E‑Mail-Adresse, um fortzufahren."
      });

      await supabase
        .from("profiles")
        .insert([{
          user_id: data.user!.id,
          email,
          first_name: metadata?.first_name ?? "",
          last_name: metadata?.last_name ?? "",
          name_affix: metadata?.name_affix ?? null,
          phone: metadata?.phone ?? "",
          role: metadata?.role ?? "sender_private",
          company_name: metadata?.company_name ?? null,
          region: metadata?.region ?? "",
          postal_code: metadata?.postal_code ?? "",
          city: metadata?.city ?? "",
          street: metadata?.street ?? null,
          house_number: metadata?.house_number ?? null,
          address_extra: metadata?.address_extra ?? null,
          profile_complete: false,
          onboarding_complete: false
        }]);

      return data;
    } catch (error) {
      handleAuthError(error as Error, "Registrierung");
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("✅ Sign out successful");
    } catch (error) {
      handleAuthError(error as Error, "Abmeldung");
      throw error;
    }
  }
};

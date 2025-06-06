
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";

export function useProfileManager() {
  const supabase = getSupabaseClient(); // Wichtig: Jetzt Factory-Pattern
  const { user, profile, refreshProfile } = useOptimizedAuth();
  const [loadingSave, setLoadingSave] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  const handleSave = async (formData: Partial<UserProfile>) => {
    if (!user) {
      toast({
        title: "Fehler",
        description: "Du musst angemeldet sein, um dein Profil zu bearbeiten.",
        variant: "destructive"
      });
      return;
    }

    setLoadingSave(true);
    try {
      const { error: upErr } = await supabase
        .from("profiles")
        .update({
          ...formData,
          profile_complete: true // Mark profile as complete when saved
        })
        .eq("user_id", user.id);

      if (upErr) {
        console.error("Profile update error:", upErr);
        throw upErr;
      }

      toast({
        title: "Gespeichert",
        description: "Dein Profil wurde aktualisiert."
      });

      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Fehler",
        description: "Profil konnte nicht gespeichert werden. Bitte versuche es später erneut.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoadingSave(false);
    }
  };

  const handleOnboarding = async () => {
    if (!user) return;

    try {
      const { error: onErr } = await supabase
        .from("profiles")
        .update({ onboarding_complete: true })
        .eq("user_id", user.id);

      if (!onErr) {
        setOnboardingComplete(true);
        if (refreshProfile) {
          await refreshProfile();
        }
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return {
    profile,
    loadingSave,
    showImageUploader,
    onboardingComplete,
    setShowImageUploader,
    handleSave,
    handleOnboarding,
  };
}

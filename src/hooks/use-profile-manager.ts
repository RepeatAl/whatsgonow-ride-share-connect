
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/types/auth";

export function useProfileManager() {
  const { user, profile, refreshProfile } = useAuth();
  const [loadingSave, setLoadingSave] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  const handleSave = async (formData: Partial<UserProfile>) => {
    setLoadingSave(true);
    try {
      const { error: upErr } = await supabase
        .from("users")
        .update(formData)
        .eq("user_id", user!.id);

      if (upErr) {
        toast({ 
          title: "Fehler", 
          description: "Profil konnte nicht gespeichert werden.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Gespeichert", 
          description: "Dein Profil wurde aktualisiert." 
        });
        await refreshProfile?.();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({ 
        title: "Fehler", 
        description: "Ein unerwarteter Fehler ist aufgetreten.", 
        variant: "destructive" 
      });
    } finally {
      setLoadingSave(false);
    }
  };

  const handleOnboarding = async () => {
    try {
      const { error: onErr } = await supabase
        .from("users")
        .update({ onboarding_complete: true })
        .eq("user_id", user!.id);
        
      if (!onErr) {
        setOnboardingComplete(true);
        await refreshProfile?.();
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

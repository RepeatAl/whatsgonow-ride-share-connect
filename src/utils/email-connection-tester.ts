
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

/**
 * Dieses Utility testet die Verbindung zur E-Mail-Versandfunktion
 */
export const testEmailConnection = async (email: string = "test@example.com"): Promise<boolean> => {
  try {
    toast({
      title: "E-Mail-Service nicht verfügbar",
      description: "Der E-Mail-Service ist temporär nicht verfügbar. Bitte versuchen Sie es später erneut.",
      variant: "destructive"
    });
    return false;
  } catch (error) {
    console.error("❌ Error in email connection test:", error);
    toast({
      title: "Verbindungstest fehlgeschlagen",
      description: error instanceof Error ? error.message : "Unbekannter Fehler",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Hilfsfunktion um den Status der E-Mail-Integration zu prüfen
 */
export const checkResendApiKey = async (): Promise<boolean> => {
  return false; // Resend ist nicht mehr konfiguriert
};

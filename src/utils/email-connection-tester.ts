
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

/**
 * Dieses Utility testet die Verbindung zur E-Mail-Versandfunktion
 */
export const testEmailConnection = async (email: string = "admin@whatsgonow.com"): Promise<boolean> => {
  try {
    console.log("Testing email connection to:", email);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { 
        to: email,
        subject: 'Whatsgonow - Test E-Mail',
        text: 'Dies ist eine Test-E-Mail von Whatsgonow.',
        html: '<p>Dies ist eine Test-E-Mail von Whatsgonow.</p>'
      }
    });
    
    if (error) {
      console.error("Error invoking send-email function:", error);
      throw error;
    }
    
    console.log("Email test response:", data);
    
    toast({
      title: "E-Mail-Test erfolgreich",
      description: "Die Verbindung zum E-Mail-Service funktioniert.",
      variant: "default"
    });
    
    return true;
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
  try {
    console.log("Checking if RESEND_API_KEY is configured...");
    
    const { data, error } = await supabase.functions.invoke('check-env-vars', {
      body: { checkVar: 'RESEND_API_KEY' }
    });
    
    if (error) {
      console.error("Error checking Resend API key:", error);
      throw error;
    }
    
    console.log("API key check result:", data);
    return data?.exists ?? false;
  } catch (error) {
    console.error("Error checking Resend API key:", error);
    return false;
  }
};

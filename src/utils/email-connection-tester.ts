
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

/**
 * Dieses Utility testet die Verbindung zur E-Mail-Versandfunktion
 */
export const testEmailConnection = async (email: string = "test@example.com"): Promise<boolean> => {
  try {
    console.log("🧪 Testing email connection to:", email);
    
    // Prüfe, ob die Edge Function verfügbar ist
    const { data: functionsList, error: functionsError } = await supabase.functions.listFunctions();
    
    if (functionsError) {
      console.error("❌ Error getting functions list:", functionsError);
      toast({
        title: "Verbindungsfehler",
        description: "Konnte keine Verbindung zu Supabase Edge Functions herstellen",
        variant: "destructive"
      });
      return false;
    }
    
    const emailFunctionExists = functionsList?.find(f => f.name === "send-email");
    if (!emailFunctionExists) {
      console.error("❌ send-email function not found in Supabase");
      toast({
        title: "Konfigurationsfehler",
        description: "Die E-Mail-Versandfunktion wurde nicht gefunden",
        variant: "destructive"
      });
      return false;
    }
    
    // Erstelle FormData für den Test
    const formData = new FormData();
    formData.append("to", email);
    formData.append("subject", "Whatsgonow – Verbindungstest");
    formData.append("body", "<h1>Test der E-Mail-Verbindung</h1><p>Diese E-Mail bestätigt, dass die Verbindung zwischen der Whatsgonow-App und dem E-Mail-Dienst funktioniert.</p>");
    
    // Testdatei anhängen
    const testFile = new Blob(["Dies ist ein Test"], { type: "text/plain" });
    formData.append("attachment_1", new File([testFile], "test.txt", { type: "text/plain" }));
    
    // Rufe die Edge Function auf
    console.log("📞 Calling send-email Edge Function");
    const response = await fetch("https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/send-email", {
      method: "POST",
      body: formData,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error("❌ Email test failed:", result);
      toast({
        title: "E-Mail-Test fehlgeschlagen",
        description: result.error || "Unbekannter Fehler beim E-Mail-Versand",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("✅ Email test succeeded:", result);
    toast({
      title: "E-Mail-Test erfolgreich",
      description: `Test-E-Mail an ${email} gesendet (${result.messageId})`,
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
 * Hilfsfunktion um den Status der Resend-Integration zu prüfen
 */
export const checkResendApiKey = async (): Promise<boolean> => {
  try {
    // Diese Funktion prüft, ob der RESEND_API_KEY im Supabase-Projekt konfiguriert ist
    const { data, error } = await supabase.functions.invoke("check-env-vars", {
      body: { checkVar: "RESEND_API_KEY" }
    });
    
    if (error) {
      console.error("❌ Error checking Resend API key:", error);
      return false;
    }
    
    return data?.exists === true;
  } catch (error) {
    console.error("❌ Error checking Resend configuration:", error);
    return false;
  }
};

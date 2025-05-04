
import { toast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

/**
 * Handle authentication errors and display appropriate toast messages
 * This file follows the conventions from /docs/conventions/roles_and_ids.md
 */
export const handleAuthError = (error: Error, context: string = "Aktion") => {
  console.error(`❌ ${context} error:`, error);
  
  // Check for specific Supabase error messages
  let errorMessage = error.message;
  
  // Übersetzte und benutzerfreundliche Fehlermeldungen
  if (error.message.includes("Email not confirmed")) {
    errorMessage = "Bitte bestätige deine E-Mail-Adresse, um fortzufahren.";
  } else if (error.message.includes("Invalid login credentials")) {
    errorMessage = "Ungültige Anmeldedaten. Bitte überprüfe deine E-Mail und dein Passwort.";
  } else if (error.message.includes("User already registered")) {
    errorMessage = "Diese E-Mail-Adresse ist bereits registriert. Bitte nutze die Anmeldung.";
  } else if (error.message.includes("Email link is invalid or has expired")) {
    errorMessage = "Der E-Mail-Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.";
  } else if (error.message.includes("Rate limit exceeded")) {
    errorMessage = "Zu viele Versuche. Bitte warte einen Moment und versuche es später erneut.";
  } else if (error.message.includes("Password should be at least 6 characters")) {
    errorMessage = "Das Passwort muss mindestens 6 Zeichen lang sein.";
  } else if (error.message.includes("Signup")) {
    errorMessage = "Fehler bei der Registrierung. Bitte versuche es später noch einmal.";
  }
  
  toast({
    title: `${context} fehlgeschlagen`,
    description: errorMessage,
    variant: "destructive",
  });
};

/**
 * Get the appropriate redirect path based on user role and profile status
 */
export const getRoleBasedRedirectPath = (role?: string): string => {
  if (!role) return "/profile";  // Send to profile if no role set
  
  switch (role) {
    case "super_admin":
    case "admin":
      return "/admin";
    case "cm":
      return "/community-manager";
    case "driver":
      return "/offer-transport";
    case "sender_business":
    case "sender_private":
    default:
      return "/dashboard";
  }
};

/**
 * Log authentication attempts for monitoring and debugging
 */
export const logAuthActivity = async (
  activity: string, 
  user: User | null, 
  details?: Record<string, any>
) => {
  console.log(`🔐 Auth Activity - ${activity}:`, {
    user: user?.id || 'anonymous',
    email: user?.email || 'none',
    timestamp: new Date().toISOString(),
    ...details
  });
  
  // In einer echten Anwendung könntest du diese Daten auch an Supabase senden
  // für fortgeschrittene Analyse und Sicherheitsmonitoring
};

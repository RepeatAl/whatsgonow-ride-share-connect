
import { toast } from "@/hooks/use-toast";
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
  } else if (error.message.includes("infinite recursion")) {
    errorMessage = "Es gab ein temporäres Problem. Bitte versuche es noch einmal.";
    // Clear auth state to prevent stuck states
    cleanupAuthState();
  }
  
  toast({
    title: `${context} fehlgeschlagen`,
    description: errorMessage,
    variant: "destructive",
  });
};

/**
 * ZENTRALE Redirect-Logik für rollenbasierte Navigation
 * Diese Funktion soll für alle Auth-Redirects verwendet werden
 */
export const getRoleBasedRedirectPath = (role?: string, lang: string = 'de'): string => {
  console.log(`🎯 getRoleBasedRedirectPath: role=${role}, lang=${lang}`);
  
  if (!role) {
    console.log("🎯 No role provided, redirecting to profile");
    return `/${lang}/profile`;
  }
  
  switch (role) {
    case "super_admin":
    case "admin":
      console.log("🎯 Admin user, redirecting to admin dashboard");
      return `/${lang}/dashboard/admin`;
    case "cm":
      console.log("🎯 CM user, redirecting to CM dashboard");
      return `/${lang}/dashboard/cm`;
    case "driver":
      console.log("🎯 Driver user, redirecting to driver dashboard");
      return `/${lang}/dashboard/driver`;
    case "sender_business":
    case "sender_private":
      console.log("🎯 Sender user, redirecting to sender dashboard");
      return `/${lang}/dashboard/sender`;
    default:
      console.log("🎯 Unknown role, redirecting to main dashboard");
      return `/${lang}/dashboard`;
  }
};

/**
 * Hilfsfunktion: Aktuelle Sprache aus URL extrahieren
 */
export const getCurrentLanguage = (pathname: string = window.location.pathname): string => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  if (['de', 'en', 'ar'].includes(firstSegment)) {
    return firstSegment;
  }
  
  return 'de'; // Fallback
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

/**
 * Clean up authentication state completely - improved version
 */
export const cleanupAuthState = () => {
  if (typeof window === 'undefined') return;

  try {
    console.log("🧹 Cleaning up auth state...");
    
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('orgcruwmxqiwnjnkxpjb')) {
        console.log(`🧹 Removing localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if used
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('orgcruwmxqiwnjnkxpjb')) {
        console.log(`🧹 Removing sessionStorage key: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    console.log("✅ Auth state cleanup completed");
  } catch (e) {
    console.error("❌ Error cleaning up auth state:", e);
  }
};

/**
 * Enhanced profile validation
 */
export const isValidProfile = (profile: any): boolean => {
  if (!profile) return false;
  
  // Basic required fields
  const hasBasicFields = profile.user_id && profile.email && profile.role;
  
  if (!hasBasicFields) {
    console.log("❌ Profile missing basic fields:", { 
      user_id: !!profile.user_id, 
      email: !!profile.email, 
      role: !!profile.role 
    });
    return false;
  }
  
  return true;
};

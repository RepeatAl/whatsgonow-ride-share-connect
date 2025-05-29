
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

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
    errorMessage = "Bitte bestätigen Sie Ihre E-Mail-Adresse, um fortzufahren.";
  } else if (error.message.includes("Invalid login credentials")) {
    errorMessage = "E-Mail oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.";
  } else if (error.message.includes("User already registered")) {
    errorMessage = "Diese E-Mail-Adresse ist bereits registriert. Bitte nutzen Sie die Anmeldung.";
  } else if (error.message.includes("Email link is invalid or has expired")) {
    errorMessage = "Der E-Mail-Link ist ungültig oder abgelaufen. Bitte fordern Sie einen neuen an.";
  } else if (error.message.includes("Rate limit exceeded") || error.message.includes("Too many requests")) {
    errorMessage = "Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es später erneut.";
  } else if (error.message.includes("Password should be at least 6 characters")) {
    errorMessage = "Das Passwort muss mindestens 6 Zeichen lang sein.";
  } else if (error.message.includes("Signup")) {
    errorMessage = "Fehler bei der Registrierung. Bitte versuchen Sie es später noch einmal.";
  } else if (error.message.includes("infinite recursion")) {
    errorMessage = "Es gab ein temporäres Problem. Bitte versuchen Sie es noch einmal.";
    // Clear auth state to prevent stuck states
    cleanupAuthState();
  } else if (error.message.includes("session_not_found")) {
    errorMessage = "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.";
  } else if (error.message.includes("same_password")) {
    errorMessage = "Das neue Passwort muss sich vom aktuellen unterscheiden.";
  } else if (error.message.includes("fetch") || error.message.includes("network")) {
    errorMessage = "Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.";
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
 * Enhanced auth state cleanup with recovery safety
 */
export const cleanupAuthState = async () => {
  if (typeof window === 'undefined') return;

  try {
    console.log("🧹 Cleaning up auth state...");
    
    // First, try to sign out gracefully
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.log("Sign out failed, continuing with cleanup...");
    }
    
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
    try {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('orgcruwmxqiwnjnkxpjb')) {
          console.log(`🧹 Removing sessionStorage key: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      // Ignore sessionStorage errors in environments where it's not available
    }
    
    console.log("✅ Auth state cleanup completed");
  } catch (e) {
    console.error("❌ Error cleaning up auth state:", e);
  }
};

/**
 * Enhanced profile validation with better error messages
 */
export const isValidProfile = (profile: any): boolean => {
  if (!profile) {
    console.log("❌ Profile is null or undefined");
    return false;
  }
  
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

/**
 * Check if current session is a recovery session (password reset)
 */
export const isRecoverySession = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if this is a recovery session
    // Recovery sessions typically have different token types or metadata
    if (session && session.user) {
      // You can check session metadata or user app_metadata for recovery indicators
      return session.user.app_metadata?.provider === 'recovery' || 
             session.access_token?.includes('recovery') || false;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking recovery session:", error);
    return false;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check password strength
 */
export const checkPasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push("Mindestens 8 Zeichen verwenden");
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Kleinbuchstaben hinzufügen");
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Großbuchstaben hinzufügen");
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Zahlen hinzufügen");
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Sonderzeichen hinzufügen");
  
  return {
    isValid: score >= 3 && password.length >= 6,
    score,
    feedback
  };
};

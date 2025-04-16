
import { createClient } from "@supabase/supabase-js";

// Umgebungsvariablen direkt verwenden oder aus .env laden
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://orgcruwmxqiwnjnkxpjb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2NydXdteHFpd25qbmt4cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ1ODYsImV4cCI6MjA2MDExMDU4Nn0.M90DOOmOg2E58oSWnX49wbRqnO6Od9RrfcUvgJpzGMI";

// Verbesserte Konfiguration mit expliziten Optionen für session handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    debug: true, // Aktivieren von Debug-Modus für mehr Logging
  }
});

// Initialisierungsfunktion für das Setup und Checks
export const initSupabase = async () => {
  try {
    // Session-Prüfung beim Start
    const { data, error } = await supabase.auth.getSession();
    
    console.log("📋 Supabase initialization check - Session:", 
      data?.session ? "Active" : "None", 
      error ? `(Error: ${error.message})` : ""
    );
    
    return { success: !error, message: error?.message };
  } catch (err) {
    console.error("🔥 Fatal error initializing Supabase:", err);
    return { success: false, message: (err as Error).message };
  }
};

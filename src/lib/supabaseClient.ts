
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://orgcruwmxqiwnjnkxpjb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2NydXdteHFpd25qbmt4cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ1ODYsImV4cCI6MjA2MDExMDU4Nn0.M90DOOmOg2E58oSWnX49wbRqnO6Od9RrfcUvgJpzGMI";

// Überprüfen, ob wir in einer Browser-Umgebung sind
const isBrowser = typeof window !== "undefined";

// Initialize Supabase client with your project details
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Nur localStorage verwenden, wenn wir in einer Browser-Umgebung sind
      storage: isBrowser ? localStorage : undefined,
      debug: true,
    }
  }
);

// 🔍 Initialisierungs-Check
export const initSupabase = async () => {
  try {
    console.log("🔄 Prüfe Supabase-Verbindung...");
    const { data, error } = await supabase.auth.getSession();
    
    console.log("📋 Supabase init check – Session:", 
      data?.session ? "Aktiv ✅" : "Keine ❌", 
      error ? `(Fehler: ${error.message})` : ""
    );

    return { success: !error, message: error?.message };
  } catch (err) {
    console.error("🔥 Fehler bei Supabase-Initialisierung:", err);
    return { success: false, message: (err as Error).message };
  }
};

// Export a check function that can be used to test connection
export const checkConnection = async () => {
  try {
    // Try a simple query to test the connection
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return { connected: true, details: { count } };
  } catch (err) {
    console.error("Connection test failed:", err);
    return { connected: false, error: (err as Error).message };
  }
};

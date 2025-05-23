
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase-Konstanten
const supabaseUrl = "https://orgcruwmxqiwnjnkxpjb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2NydXdteHFpd25qbmt4cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ1ODYsImV4cCI6MjA2MDExMDU4Nn0.M90DOOmOg2E58oSWnX49wbRqnO6Od9RrfcUvgJpzGMI";

// Funktion, die den Supabase-Client "lazy" erstellt
export function getSupabaseClient(): SupabaseClient {
  const isBrowser = typeof window !== "undefined";
  
  // Storage-Objekt für Node.js-Umgebungen (für Tests)
  const nodeStorage = {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => {},
    removeItem: (key: string) => {},
    clear: () => {},
    length: 0,
    key: (index: number) => null
  };

  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: isBrowser ? localStorage : nodeStorage,
        debug: true,
      },
    }
  );
}

// Convenience: Exportiere einen sofortigen Client (wird im Browser verwendet)
export const supabase = getSupabaseClient();

// Initialisierungs-Check: Nutzt jetzt immer den Lazy-Client!
export const initSupabase = async () => {
  try {
    const supabase = getSupabaseClient();
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

// Verbindung prüfen: Nutzt jetzt immer den Lazy-Client!
export const checkConnection = async () => {
  try {
    const supabase = getSupabaseClient();
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

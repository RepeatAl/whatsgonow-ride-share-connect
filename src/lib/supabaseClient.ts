
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase-Konstanten
const supabaseUrl = "https://orgcruwmxqiwnjnkxpjb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2NydXdteHFpd25qbmt4cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ1ODYsImV4cCI6MjA2MDExMDU4Nn0.M90DOOmOg2E58oSWnX49wbRqnO6Od9RrfcUvgJpzGMI";

// Singleton Supabase Client - nur einmal erstellen
let supabaseInstance: SupabaseClient | null = null;

// Funktion, die den Supabase-Client "lazy" erstellt
export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const isBrowser = typeof window !== "undefined";
  
  // FIXED: Mobile-Auth verbessert - explizite Storage-Konfiguration
  const storage = isBrowser ? {
    getItem: (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('LocalStorage access failed:', e);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('LocalStorage write failed:', e);
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage remove failed:', e);
      }
    },
    clear: () => {
      try {
        localStorage.clear();
      } catch (e) {
        console.warn('LocalStorage clear failed:', e);
      }
    },
    length: 0,
    key: (index: number) => null
  } : {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => {},
    removeItem: (key: string) => {},
    clear: () => {},
    length: 0,
    key: (index: number) => null
  };

  supabaseInstance = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        // FIXED: Mobile-Auth Verbesserungen
        persistSession: true,
        autoRefreshToken: true,
        storage: storage,
        storageKey: 'whatsgonow-auth',
        debug: false,
        // FIXED: Mobile-spezifische Einstellungen
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      // FIXED: CORS-Headers für Mobile
      global: {
        headers: {
          'X-Client-Info': 'whatsgonow-web'
        }
      }
    }
  );

  console.log('Supabase client created (singleton) - Mobile optimized');
  return supabaseInstance;
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

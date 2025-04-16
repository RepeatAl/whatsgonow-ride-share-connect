import { createClient } from "@supabase/supabase-js";

// 🛡️ Sicherstellen, dass ENV-Variablen vorhanden sind
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase-Umgebungsvariablen fehlen. Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY setzen.");
}

// ✅ Supabase-Client initialisieren
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    debug: true,
  }
});

// 🔍 Initialisierungs-Check
export const initSupabase = async () => {
  try {
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

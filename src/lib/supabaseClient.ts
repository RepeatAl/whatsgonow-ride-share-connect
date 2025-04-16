
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with your project details
export const supabase = createClient(
  "https://orgcruwmxqiwnjnkxpjb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2NydXdteHFpd25qbmt4cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ1ODYsImV4cCI6MjA2MDExMDU4Nn0.M90DOOmOg2E58oSWnX49wbRqnO6Od9RrfcUvgJpzGMI",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage,
      debug: true,
    }
  }
);

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

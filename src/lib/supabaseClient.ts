
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://orgcruwmxqiwnjnkxpjb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ2NydXdteHFpd25qbmt4cGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ1ODYsImV4cCI6MjA2MDExMDU4Nn0.M90DOOmOg2E58oSWnX49wbRqnO6Od9RrfcUvgJpzGMI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  }
});

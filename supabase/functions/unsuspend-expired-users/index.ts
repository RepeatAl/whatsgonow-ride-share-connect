
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight handler
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Supabase Client mit Service Role Key initialisieren
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Führe die RPC-Funktion aus
    const { data, error } = await supabase.rpc("unsuspend_expired_users");

    if (error) {
      throw error;
    }

    // Anzahl betroffener Nutzer abfragen
    const { data: affectedUsersData, error: countError } = await supabase
      .from("system_logs")
      .select("count(*)")
      .eq("event_type", "suspension_expired")
      .gte("created_at", new Date(Date.now() - 30000).toISOString()); // In den letzten 30 Sekunden

    const affectedUsers = affectedUsersData?.[0]?.count || 0;

    console.log(`Prüfung auf abgelaufene Suspendierungen durchgeführt. ${affectedUsers} Nutzer wurden entsperrt.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Prüfung auf abgelaufene Suspendierungen abgeschlossen.`,
        affected_users: affectedUsers
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Fehler beim Entsperren abgelaufener Nutzer:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Ein unbekannter Fehler ist aufgetreten."
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

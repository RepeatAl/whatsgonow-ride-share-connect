
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS-Präflight-Anfragen behandeln
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Supabase-Client initialisieren
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Authentifizierungsstatus prüfen
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorisierter Zugriff" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Request-Body parsen
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Auftrags-ID erforderlich" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Veröffentliche Auftrag: ${orderId} durch Nutzer: ${user.id}`);

    // Auftrag aus Datenbank laden
    const { data: orderData, error: orderError } = await supabaseClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      console.error("Fehler beim Laden des Auftrags:", orderError);
      return new Response(
        JSON.stringify({ error: "Auftrag nicht gefunden" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prüfen, ob der Nutzer der Besitzer des Auftrags ist
    if (orderData.sender_id !== user.id) {
      return new Response(
        JSON.stringify({
          error: "Nur der Auftraggeber darf veröffentlichen",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prüfen, ob der Auftrag bereits veröffentlicht wurde
    if (orderData.published_at) {
      return new Response(
        JSON.stringify({ error: "Auftrag ist bereits veröffentlicht" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Auftrag veröffentlichen
    const { error: updateError } = await supabaseClient
      .from("orders")
      .update({
        status: "open",
        published_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Fehler beim Veröffentlichen des Auftrags:", updateError);
      return new Response(
        JSON.stringify({ error: "Fehler beim Update" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Erfolgsmeldung zurückgeben
    return new Response(
      JSON.stringify({
        success: true,
        message: "Auftrag erfolgreich veröffentlicht",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return new Response(
      JSON.stringify({ error: "Interner Serverfehler" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

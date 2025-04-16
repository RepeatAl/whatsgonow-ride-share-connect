
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS Headers für Cross-Origin Anfragen
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, redirectUrl } = await req.json();

    // Für Testzwecke nur Logging, keine echte E-Mail
    console.log(`Simulation: E-Mail-Versand an ${email} vom Typ ${type}`);
    
    // Hier würde normaleweise ein E-Mail-Versand stattfinden
    // In einer Produktionsumgebung würde man einen Dienst wie Resend verwenden

    return new Response(
      JSON.stringify({
        success: true,
        message: "E-Mail wurde simuliert (nur für Testzwecke)",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Fehler beim Verarbeiten der E-Mail-Anfrage:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Ein Fehler ist aufgetreten" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface CheckVarRequest {
  checkVar: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { checkVar }: CheckVarRequest = await req.json();
    
    if (!checkVar) {
      return new Response(
        JSON.stringify({ error: "No variable name provided" }), 
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }
    
    // Sichere Prüfung, ob eine Umgebungsvariable existiert, ohne Wert preiszugeben
    const exists = Deno.env.get(checkVar) !== undefined;
    
    return new Response(
      JSON.stringify({ 
        exists,
        variable: checkVar
      }), 
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error checking environment variable:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to check environment variable", 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );
  }
};

serve(handler);

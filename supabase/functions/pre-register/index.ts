
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.24.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { sendConfirmation } from "../send-confirmation/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Schema aligned with frontend validation
const preRegisterSchema = z.object({
  first_name: z.string().min(2, "Vorname muss mindestens 2 Zeichen lang sein"),
  last_name: z.string().min(2, "Nachname muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  postal_code: z.string().min(4, "Ungültige Postleitzahl"),
  wants_driver: z.boolean().default(false),
  wants_cm: z.boolean().default(false),
  wants_sender: z.boolean().default(false),
  vehicle_types: z.object({
    car: z.array(z.enum(["S", "M", "L", "XL", "XXL"])).optional(),
    motorcycle: z.boolean().optional(),
    bicycle: z.boolean().optional(),
    ship: z.boolean().optional(),
    plane: z.boolean().optional(),
    other: z.string().optional()
  }).optional(),
  gdpr_consent: z.boolean().refine((val) => val === true, {
    message: "Bitte stimmen Sie den Datenschutzbestimmungen zu"
  })
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const json = await req.json();
    const data = preRegisterSchema.parse(json);

    // Extract UTM parameters from referer if available
    const source = req.headers.get("referer");

    // Insert into database
    const { error: dbError } = await supabase
      .from("pre_registrations")
      .insert([{ 
        ...data,
        source,
        notification_sent: false
      }]);

    if (dbError) throw dbError;

    // Send confirmation email
    await sendConfirmation({ 
      email: data.email, 
      firstName: data.first_name 
    });

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 201,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        }
      }
    );
  } catch (err) {
    console.error("Pre-register error:", err);

    if (err instanceof z.ZodError) {
      // Format errors to match React Hook Form structure
      const formattedErrors = {};
      err.errors.forEach((error) => {
        if (error.path) {
          formattedErrors[error.path.join(".")] = error.message;
        }
      });

      return new Response(
        JSON.stringify({ errors: formattedErrors }),
        { 
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten" 
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
});

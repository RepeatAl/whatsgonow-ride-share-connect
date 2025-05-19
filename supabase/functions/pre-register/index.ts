
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.24.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

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
  vehicle_types: z.array(
    z.enum(["S", "M", "L", "XL", "XXL", "MOPED", "BIKE", "BOAT", "PLANE"])
  ).optional(),
  gdpr_consent: z.boolean().refine((val) => val === true, {
    message: "Bitte stimmen Sie den Datenschutzbestimmungen zu"
  })
}).superRefine((data, ctx) => {
  if (data.wants_driver) {
    if (!data.vehicle_types || data.vehicle_types.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vehicle_types"],
        message: "Bitte wähle mindestens eine Fahrzeuggröße aus."
      });
    }
  }
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

async function sendConfirmationEmail(email: string, firstName: string) {
  try {
    console.log(`Attempting to send confirmation email to: ${email}`);
    
    const response = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ email, firstName }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to send confirmation email: ${error}`);
    }
    
    const result = await response.json();
    console.log("Confirmation email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error calling send-confirmation function:", error);
    throw error;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const json = await req.json();
    console.log("Received pre-registration data:", JSON.stringify(json));
    
    const data = preRegisterSchema.parse(json);

    // Log email before any potential normalization
    console.log(`Original submitted email: ${data.email}`);
    
    // Extract original email domain for tracking
    const emailParts = data.email.split('@');
    const originalDomain = emailParts.length > 1 ? emailParts[1] : null;
    
    // Extract UTM parameters from referer if available
    const source = req.headers.get("referer");
    console.log(`Request source (referer): ${source}`);

    // Get the language from the Accept-Language header or default to 'de'
    const acceptLanguage = req.headers.get("Accept-Language") || "de";
    // Extract the language code (can be improved to better parse Accept-Language)
    let language = acceptLanguage.split(',')[0].split('-')[0];
    
    // Check if a specific language was provided in the request body
    if (json.language) {
      language = json.language;
    }
    
    // Only accept supported languages
    if (!['de', 'en', 'ar'].includes(language)) {
      language = 'de'; // Default to German if unsupported
    }
    
    console.log(`Using language for registration: ${language}`);

    // Insert into database
    console.log(`Inserting data into pre_registrations table...`);
    const { data: insertedData, error: dbError } = await supabase
      .from("pre_registrations")
      .insert([{ 
        ...data,
        source,
        language,
        notification_sent: false,
        notes: originalDomain !== 'gmail.com' && data.email.includes('gmail.com') 
          ? `Original domain: ${originalDomain}` 
          : null
      }]);

    if (dbError) {
      console.error("Database insertion error:", dbError);
      throw dbError;
    }

    console.log("Pre-registration data inserted successfully");
    
    // Log the final email that was stored
    console.log(`Email stored in database: ${data.email}`);

    // Send confirmation email
    await sendConfirmationEmail(data.email, data.first_name);

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

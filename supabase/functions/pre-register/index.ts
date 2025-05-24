
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.24.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, accept-language",
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
  }),
  language: z.string().optional().default("de")
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

// Use service role key for database operations (no auth required)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

async function sendConfirmationEmail(email: string, firstName: string, language: string = "de") {
  try {
    console.log(`Attempting to send confirmation email to: ${email} in language: ${language}`);
    
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return { success: false, error: "Email service not configured" };
    }
    
    const response = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-confirmation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "Accept-Language": language,
        },
        body: JSON.stringify({ 
          email, 
          firstName,
          language 
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send confirmation email. Status: ${response.status}, Error: ${errorText}`);
      return { success: false, error: errorText };
    }
    
    const result = await response.json();
    console.log("Confirmation email sent successfully:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Error calling send-confirmation function:", error);
    return { success: false, error: error.message };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[Pre-Register] Processing ${req.method} request`);
    
    const json = await req.json();
    console.log("Received pre-registration data:", JSON.stringify(json, null, 2));
    
    const data = preRegisterSchema.parse(json);

    console.log(`Processing registration for email: ${data.email}, language: ${data.language}`);
    
    // Extract original email domain for tracking
    const emailParts = data.email.split('@');
    const originalDomain = emailParts.length > 1 ? emailParts[1] : null;
    
    // Extract UTM parameters from referer if available
    const source = req.headers.get("referer");
    const userAgent = req.headers.get("user-agent");
    console.log(`Request source (referer): ${source}`);
    console.log(`User agent: ${userAgent}`);

    // Get the language from headers or request body
    const acceptLanguage = req.headers.get("Accept-Language") || "de";
    let language = data.language || acceptLanguage.split(',')[0].split('-')[0];
    
    // Only accept supported languages
    if (!['de', 'en', 'ar'].includes(language)) {
      language = 'de'; // Default to German if unsupported
    }
    
    console.log(`Using language for registration: ${language}`);

    // Insert into database (no auth required - public function)
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
      }])
      .select()
      .single();

    if (dbError) {
      console.error("Database insertion error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Pre-registration data inserted successfully:", insertedData);
    
    // Send confirmation email (don't fail if email fails)
    const emailResult = await sendConfirmationEmail(data.email, data.first_name, language);
    
    if (!emailResult.success) {
      console.warn("Email sending failed, but registration was successful:", emailResult.error);
      // Update notification_sent to false since email failed
      await supabase
        .from("pre_registrations")
        .update({ notification_sent: false })
        .eq("id", insertedData.id);
    } else {
      // Update notification_sent to true since email was successful
      await supabase
        .from("pre_registrations")
        .update({ notification_sent: true })
        .eq("id", insertedData.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        email_sent: emailResult.success,
        registration_id: insertedData.id
      }),
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

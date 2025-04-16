
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with the API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if Resend API key is configured
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured in environment variables");
    return new Response(
      JSON.stringify({ 
        error: "Email service is not properly configured. RESEND_API_KEY is missing."
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

  try {
    const { to, subject, text, html }: EmailRequest = await req.json();

    if (!to || !subject) {
      throw new Error("Empfänger und Betreff sind erforderlich");
    }

    console.log("Attempting to send email to:", to);
    console.log("Resend API Key status:", resendApiKey ? "✅ Present" : "❌ Missing");

    const emailResponse = await resend.emails.send({
      from: "Whatsgonow <noreply@whatsgonow.com>",
      to: [to],
      subject: subject,
      text: text,
      html: html || text
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify(emailResponse), 
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unbekannter Fehler beim E-Mail-Versand",
        hint: "Überprüfe die RESEND_API_KEY Konfiguration in den Supabase Secrets"
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

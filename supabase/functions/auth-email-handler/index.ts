
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with the API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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
    
    console.log(`Processing email request for ${email} of type ${type}`);
    console.log("Resend API Key status:", resendApiKey ? "✅ Present" : "❌ Missing");

    // Überprüfen, ob der Resend API-Key konfiguriert ist
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured, falling back to simulation mode");
      // Für Testzwecke nur Logging, keine echte E-Mail
      console.log(`Simulation: E-Mail-Versand an ${email} vom Typ ${type}`);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: "E-Mail wurde simuliert (nur für Testzwecke, kein RESEND_API_KEY konfiguriert)",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Wenn der API-Key vorhanden ist, echte E-Mail senden
    let emailContent = "Willkommen bei Whatsgonow!";
    let emailSubject = "Willkommen bei Whatsgonow";
    
    if (type === "signup") {
      emailSubject = "Willkommen bei Whatsgonow - Bestätigen Sie Ihre E-Mail";
      emailContent = `
        <h1>Willkommen bei Whatsgonow!</h1>
        <p>Danke für Ihre Registrierung. Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:</p>
        <p><a href="${redirectUrl || 'https://whatsgonow.com/confirm'}">E-Mail-Adresse bestätigen</a></p>
        <p>Wenn Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.</p>
      `;
    } else if (type === "reset") {
      emailSubject = "Whatsgonow - Zurücksetzen Ihres Passworts";
      emailContent = `
        <h1>Passwort zurücksetzen</h1>
        <p>Sie haben angefordert, Ihr Passwort zurückzusetzen. Bitte klicken Sie auf den folgenden Link, um fortzufahren:</p>
        <p><a href="${redirectUrl || 'https://whatsgonow.com/reset-password'}">Passwort zurücksetzen</a></p>
        <p>Wenn Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.</p>
      `;
    }
    
    const emailResponse = await resend.emails.send({
      from: "Whatsgonow <noreply@whatsgonow.com>",
      to: [email],
      subject: emailSubject,
      html: emailContent
    });
    
    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "E-Mail wurde erfolgreich gesendet",
        data: emailResponse
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Fehler beim Verarbeiten der E-Mail-Anfrage:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten",
        hint: "Überprüfe die RESEND_API_KEY Konfiguration in den Supabase Secrets"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

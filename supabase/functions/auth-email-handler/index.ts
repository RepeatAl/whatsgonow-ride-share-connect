
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    console.log('[auth-email-handler] Function started');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    const { email, type, redirectUrl } = await req.json();
    
    console.log(`[auth-email-handler] Processing email request for ${email} of type ${type}`);

    // Validate required fields
    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, type" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Email content based on type
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
    
    console.log('[auth-email-handler] Sending email via send-email-enhanced...');

    // Use invoke('send-email-enhanced') instead of direct Resend call
    const { data: emailResult, error: emailError } = await supabaseClient.functions.invoke('send-email-enhanced', {
      body: {
        to: email,
        subject: emailSubject,
        html: emailContent,
        from: 'Whatsgonow <noreply@whatsgonow.com>',
        replyTo: 'support@whatsgonow.com'
      }
    });

    if (emailError) {
      console.error('[auth-email-handler] send-email-enhanced error:', emailError);
      return new Response(
        JSON.stringify({ 
          error: "Email failed", 
          details: emailError.message 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log('[auth-email-handler] Email sent successfully via send-email-enhanced:', emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: "E-Mail wurde erfolgreich gesendet",
        data: emailResult
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[auth-email-handler] Fehler beim Verarbeiten der E-Mail-Anfrage:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Ein Fehler ist aufgetreten"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

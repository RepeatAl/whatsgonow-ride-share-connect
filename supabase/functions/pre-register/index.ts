
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔄 Pre-register function called');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const payload = await req.json();
    console.log('📥 Payload received:', { 
      email: payload.email, 
      has_vehicle_types: !!payload.vehicle_types,
      wants_driver: payload.wants_driver 
    });

    const { 
      first_name, 
      last_name, 
      email, 
      postal_code, 
      wants_driver, 
      wants_cm, 
      wants_sender, 
      vehicle_types,
      gdpr_consent,
      language = 'de',
      source = 'website',
      consent_version = '1.0'
    } = payload;

    // ENHANCED: Comprehensive validation
    if (!first_name || !last_name || !email || !postal_code) {
      console.error('❌ Missing required fields:', { first_name: !!first_name, last_name: !!last_name, email: !!email, postal_code: !!postal_code });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!gdpr_consent) {
      console.error('❌ GDPR consent required');
      return new Response(
        JSON.stringify({ error: 'GDPR consent is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // ENHANCED: E-Mail-Format validation (server-side)
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      console.error('❌ Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // ENHANCED: Vehicle types validation for drivers
    if (wants_driver && (!vehicle_types || vehicle_types.length === 0)) {
      console.error('❌ Vehicle types required for drivers');
      return new Response(
        JSON.stringify({ error: 'Vehicle types are required when registering as a driver' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('📝 Inserting pre-registration:', { email, first_name, last_name });

    // Check if email already exists
    const { data: existingReg, error: checkError } = await supabaseClient
      .from('pre_registrations')
      .select('id, email, created_at')
      .eq('email', email)
      .single()

    if (existingReg) {
      console.log('⚠️ Email already pre-registered:', existingReg.email);
      return new Response(
        JSON.stringify({ 
          error: 'Diese E-Mail-Adresse ist bereits für die Vorregistrierung angemeldet.',
          suggestion: 'Sie können direkt zur Registrierung wechseln.',
          existing: true,
          email: existingReg.email
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // ENHANCED: Insert with all required fields
    const { data: preRegData, error: insertError } = await supabaseClient
      .from('pre_registrations')
      .insert([
        {
          first_name,
          last_name,
          email,
          postal_code,
          wants_driver: !!wants_driver,
          wants_cm: !!wants_cm,
          wants_sender: !!wants_sender,
          vehicle_types: vehicle_types || [],
          gdpr_consent: true,
          language,
          source,
          consent_version,
          notification_sent: false // Will be updated after email success
        }
      ])
      .select()
      .single()

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      
      if (insertError.code === '23505') { // Unique violation
        return new Response(
          JSON.stringify({ 
            error: 'Diese E-Mail-Adresse ist bereits registriert',
            suggestion: 'Sie können direkt zur Registrierung wechseln.',
            existing: true
          }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      return new Response(
        JSON.stringify({ error: 'Database error: ' + insertError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Pre-registration inserted successfully:', preRegData.id);

    // REFACTORED: Email sending via send-email-enhanced Function
    let emailSent = false;
    let emailSendFailed = false;
    
    try {
      console.log('📧 Attempting to send confirmation email via send-email-enhanced...');
      
      // Language-specific email content
      const emailContent = {
        de: {
          subject: 'Vielen Dank für Ihre Vorregistrierung bei Whatsgonow',
          greeting: `Hallo ${first_name}`,
          message: 'Vielen Dank für Ihre Vorregistrierung bei Whatsgonow! Wir haben Ihre Daten erhalten und werden Sie kontaktieren, sobald unsere Plattform in Ihrer Region verfügbar ist.',
          info: 'Sie erhalten automatisch eine Benachrichtigung, wenn Sie sich vollständig registrieren können.',
          cta: 'Sie können sich auch jetzt schon vollständig registrieren:',
          button: 'Jetzt registrieren',
          footer: 'Ihr Whatsgonow Team'
        },
        en: {
          subject: 'Thank you for your pre-registration with Whatsgonow',
          greeting: `Hello ${first_name}`,
          message: 'Thank you for your pre-registration with Whatsgonow! We have received your information and will contact you as soon as our platform is available in your region.',
          info: 'You will automatically receive a notification when you can complete your registration.',
          cta: 'You can also register completely now:',
          button: 'Register now',
          footer: 'Your Whatsgonow Team'
        }
      };

      const content = emailContent[language as keyof typeof emailContent] || emailContent.de;
      const registerUrl = `https://preview--whatsgonow-ride-share-connect.lovable.app/register?email=${encodeURIComponent(email)}`;

      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${content.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; }
            .logo { color: #ff6b35; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { margin: 20px 0; }
            .cta-button { 
              display: inline-block; 
              background-color: #ff6b35; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
              font-weight: bold;
            }
            .footer { color: #999; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Whatsgonow</div>
              <h2 style="color: #333; margin: 0;">${content.greeting}!</h2>
            </div>
            <div class="content">
              <p>${content.message}</p>
              <p>${content.info}</p>
              <p><strong>${content.cta}</strong></p>
              <a href="${registerUrl}" class="cta-button">${content.button}</a>
            </div>
            <div class="footer">
              <p>${content.footer}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // REFACTORED: Use send-email-enhanced function instead of direct Resend API call
      const { data: emailResult, error: emailError } = await supabaseClient.functions.invoke('send-email-enhanced', {
        body: {
          to: email,
          subject: content.subject,
          html: htmlBody,
          from: 'Whatsgonow <noreply@whatsgonow.com>',
          replyTo: 'support@whatsgonow.com'
        }
      });

      if (emailError) {
        console.error('❌ send-email-enhanced error:', emailError);
        emailSendFailed = true;
      } else {
        console.log('✅ Email sent successfully via send-email-enhanced:', emailResult);
        emailSent = true;
      }

    } catch (emailError) {
      console.error('⚠️ Email sending exception:', emailError);
      emailSendFailed = true;
    }

    // ENHANCED: Atomic update of notification status
    if (emailSent) {
      try {
        await supabaseClient
          .from('pre_registrations')
          .update({ notification_sent: true })
          .eq('id', preRegData.id);
        console.log('✅ Updated notification_sent flag to true');
      } catch (updateError) {
        console.error('⚠️ Failed to update notification_sent flag:', updateError);
        // Non-critical error, continue
      }
    }

    // ENHANCED: Return detailed status
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: preRegData.id,
        email_sent: emailSent,
        email_send_failed: emailSendFailed,
        message: emailSent 
          ? 'Vorregistrierung abgeschlossen. Bestätigungs-E-Mail wurde versendet.' 
          : emailSendFailed
          ? 'Vorregistrierung abgeschlossen. Bestätigungs-E-Mail konnte nicht versendet werden.'
          : 'Vorregistrierung abgeschlossen.'
      }),
      { 
        status: 201, // Changed to 201 for created
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error in pre-register function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

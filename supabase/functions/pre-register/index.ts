
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
      source = 'website'
    } = await req.json()

    // Validation
    if (!first_name || !last_name || !email || !postal_code) {
      console.error('❌ Missing required fields');
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

    // E-Mail-Format prüfen
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
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

    // FIXED: Service Role Key verwenden für direkten Admin-Zugriff
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
          consent_version: '1.0'
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
            suggestion: 'Sie können direkt zur Registrierung wechseln.'
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

    // FIXED: Bestätigungs-E-Mail über Resend senden
    let emailSent = false;
    try {
      console.log('📧 Attempting to send confirmation email via Resend...');
      
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (!RESEND_API_KEY) {
        console.error('❌ RESEND_API_KEY not configured');
      } else {
        // Sprach-spezifische E-Mail-Inhalte
        const emailContent = {
          de: {
            subject: 'Vielen Dank für Ihre Vorregistrierung bei Whatsgonow',
            greeting: `Hallo ${first_name}`,
            message: 'Vielen Dank für Ihre Vorregistrierung bei Whatsgonow! Wir haben Ihre Daten erhalten und werden Sie kontaktieren, sobald unsere Plattform in Ihrer Region verfügbar ist.',
            info: 'Sie erhalten automatisch eine Benachrichtigung, wenn Sie sich vollständig registrieren können.',
            footer: 'Ihr Whatsgonow Team'
          },
          en: {
            subject: 'Thank you for your pre-registration with Whatsgonow',
            greeting: `Hello ${first_name}`,
            message: 'Thank you for your pre-registration with Whatsgonow! We have received your information and will contact you as soon as our platform is available in your region.',
            info: 'You will automatically receive a notification when you can complete your registration.',
            footer: 'Your Whatsgonow Team'
          },
          ar: {
            subject: 'شكراً لك على التسجيل المسبق في Whatsgonow',
            greeting: `مرحباً ${first_name}`,
            message: 'شكراً لك على التسجيل المسبق في Whatsgonow! لقد تلقينا معلوماتك وسنتواصل معك بمجرد توفر منصتنا في منطقتك.',
            info: 'ستتلقى إشعاراً تلقائياً عندما يمكنك إكمال تسجيلك.',
            footer: 'فريق Whatsgonow'
          }
        };

        const content = emailContent[language as keyof typeof emailContent] || emailContent.de;

        const htmlBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>${content.subject}</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h1 style="color: #ff6b35; margin-bottom: 20px;">Whatsgonow</h1>
              <h2 style="color: #333;">${content.greeting}!</h2>
              <p style="color: #666; line-height: 1.6;">${content.message}</p>
              <p style="color: #666; line-height: 1.6;">${content.info}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 14px;">${content.footer}</p>
            </div>
          </body>
          </html>
        `;

        // FIXED: Tatsächlicher Resend API Call
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Whatsgonow <noreply@whatsgonow.com>',
            to: [email],
            subject: content.subject,
            html: htmlBody,
          }),
        });

        const emailResult = await emailResponse.json();
        console.log('📧 Resend API Response:', { status: emailResponse.status, result: emailResult });

        if (!emailResponse.ok) {
          console.error('❌ Resend API error:', emailResult);
        } else {
          console.log('✅ Email sent successfully via Resend:', emailResult.id);
          emailSent = true;
          
          // Markiere als E-Mail versendet
          await supabaseClient
            .from('pre_registrations')
            .update({ notification_sent: true })
            .eq('id', preRegData.id);
        }
      }
    } catch (emailError) {
      console.error('⚠️ Email sending exception:', emailError);
      // E-Mail-Fehler ist nicht kritisch - Pre-Registration war trotzdem erfolgreich
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: preRegData.id,
        email_sent: emailSent,
        message: emailSent 
          ? 'Vorregistrierung abgeschlossen. Bestätigungs-E-Mail wurde versendet.' 
          : 'Vorregistrierung abgeschlossen. Bestätigungs-E-Mail konnte nicht versendet werden.'
      }),
      { 
        status: 200, 
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

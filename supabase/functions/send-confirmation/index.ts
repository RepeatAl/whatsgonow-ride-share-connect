
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📧 Send-confirmation function called');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    const { email, first_name, language = 'de', type = 'pre_registration' } = await req.json()

    if (!email || !first_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Language-specific email content
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
    }

    const content = emailContent[language as keyof typeof emailContent] || emailContent.de

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
    `

    console.log('📧 Sending email via send-email-enhanced...');

    // Use invoke('send-email-enhanced') instead of direct Resend call
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
      return new Response(
        JSON.stringify({ error: 'Email failed', details: emailError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Email sent successfully via send-email-enhanced:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        email_id: emailResult?.data?.id,
        message: 'Confirmation email sent successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error in send-confirmation function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})


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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
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

    // Pre-Registration in Datenbank einfügen
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
          JSON.stringify({ error: 'This email address is already registered' }),
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

    // Bestätigungs-E-Mail senden
    try {
      console.log('📧 Sending confirmation email...');
      
      const { data: emailResult, error: emailError } = await supabaseClient.functions.invoke('send-confirmation', {
        body: {
          email,
          first_name,
          language,
          type: 'pre_registration',
          pre_registration_id: preRegData.id
        }
      })

      if (emailError) {
        console.error('⚠️ Email sending failed:', emailError);
        // E-Mail-Fehler ist nicht kritisch - Pre-Registration war erfolgreich
      } else {
        console.log('✅ Confirmation email sent successfully');
        
        // Markiere als E-Mail versendet
        await supabaseClient
          .from('pre_registrations')
          .update({ notification_sent: true })
          .eq('id', preRegData.id)
      }
    } catch (emailError) {
      console.error('⚠️ Email sending exception:', emailError);
      // E-Mail-Fehler ist nicht kritisch
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: preRegData.id,
        message: 'Pre-registration completed successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Unexpected error in pre-register function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

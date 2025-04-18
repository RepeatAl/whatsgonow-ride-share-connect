
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { first_name, last_name, email, postal_code, wants_driver, wants_cm, wants_sender, vehicle_types, gdpr_consent } = await req.json()

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Insert pre-registration data
    const { error } = await supabase
      .from('pre_registrations')
      .insert([
        {
          first_name,
          last_name,
          email,
          postal_code,
          wants_driver,
          wants_cm,
          wants_sender,
          vehicle_types,
          gdpr_consent,
          source: req.headers.get('referer'),
          consent_version: '1.0'
        }
      ])

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400 
      }
    )
  }
})

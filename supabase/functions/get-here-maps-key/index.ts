
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get HERE Maps API key and App ID from environment (Supabase Secrets)
    const apiKey = Deno.env.get('HERE_MAPS_API_KEY')
    const appId = Deno.env.get('HERE_MAPS_APP_ID')
    
    if (!apiKey) {
      console.error('HERE_MAPS_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'HERE Maps API Key nicht konfiguriert',
          details: 'Bitte konfigurieren Sie HERE_MAPS_API_KEY in den Supabase Secrets'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!appId) {
      console.error('HERE_MAPS_APP_ID not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'HERE Maps App ID nicht konfiguriert',
          details: 'Bitte konfigurieren Sie HERE_MAPS_APP_ID in den Supabase Secrets'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('HERE Maps API Key und App ID erfolgreich geladen')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        apiKey: apiKey,
        appId: appId,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error in get-here-maps-key function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Interner Serverfehler',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

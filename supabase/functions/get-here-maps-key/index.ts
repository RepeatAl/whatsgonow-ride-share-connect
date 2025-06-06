
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
    
    console.log('🔍 Environment check:')
    console.log('- HERE_MAPS_API_KEY exists:', !!apiKey)
    console.log('- HERE_MAPS_APP_ID exists:', !!appId)
    
    if (!apiKey) {
      console.error('❌ HERE_MAPS_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'HERE Maps API Key nicht konfiguriert',
          details: 'Bitte konfigurieren Sie HERE_MAPS_API_KEY in den Supabase Secrets',
          troubleshooting: {
            step1: 'Gehen Sie zu Supabase Dashboard > Settings > Edge Functions',
            step2: 'Fügen Sie HERE_MAPS_API_KEY als Secret hinzu',
            step3: 'Aktivieren Sie folgende Services im HERE Developer Portal:',
            services: [
              'HERE Maps API for JavaScript',
              'Map Tile API v3', 
              'HERE Vector Tile API v2'
            ]
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!appId) {
      console.error('❌ HERE_MAPS_APP_ID not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'HERE Maps App ID nicht konfiguriert',
          details: 'Bitte konfigurieren Sie HERE_MAPS_APP_ID in den Supabase Secrets',
          troubleshooting: {
            step1: 'Gehen Sie zu Supabase Dashboard > Settings > Edge Functions',
            step2: 'Fügen Sie HERE_MAPS_APP_ID als Secret hinzu',
            step3: 'Verifizieren Sie die Domain in HERE Developer Portal',
            domain: 'preview--whatsgonow-ride-share-connect.lovable.app'
          }
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('✅ HERE Maps API Key und App ID erfolgreich geladen')
    console.log('🔧 Services check: Stellen Sie sicher, dass folgende Services aktiviert sind:')
    console.log('   - HERE Maps API for JavaScript')
    console.log('   - Map Tile API v3')
    console.log('   - HERE Vector Tile API v2')
    
    // Mask sensitive information in logs
    const maskedApiKey = apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4);
    const maskedAppId = appId.substring(0, 8) + '...' + appId.substring(appId.length - 4);
    
    console.log(`🔑 API Key: ${maskedApiKey}`)
    console.log(`🆔 App ID: ${maskedAppId}`)
    
    return new Response(
      JSON.stringify({ 
        success: true,
        apiKey: apiKey,
        appId: appId,
        timestamp: new Date().toISOString(),
        services: {
          required: [
            'HERE Maps API for JavaScript',
            'Map Tile API v3',
            'HERE Vector Tile API v2'
          ],
          note: 'Alle Services müssen im HERE Developer Portal verknüpft sein'
        },
        domain: {
          current: 'preview--whatsgonow-ride-share-connect.lovable.app',
          status: 'Muss als Trusted Domain eingetragen sein'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('💥 Error in get-here-maps-key function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Interner Serverfehler',
        details: error.message,
        troubleshooting: {
          commonIssues: [
            'Domain nicht in HERE Developer Portal registriert',
            'Services nicht aktiviert/verknüpft',
            'API Key oder App ID ungültig',
            'CSP Headers blockieren HERE URLs'
          ]
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

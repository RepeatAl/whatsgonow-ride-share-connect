
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  active?: boolean;
  company_name?: string;
  profile_complete?: boolean;
}

function isProfileIncomplete(profile: UserProfile | null): boolean {
  if (!profile) return true;

  const { name, region, role, company_name, profile_complete } = profile;

  if (!profile_complete) return true;
  if (!name || !region || !role) return true;
  if (role === 'sender_business' && !company_name) return true;

  return false;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Erstelle einen Supabase-Client mit den Auth-Credentials aus dem Request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Keine Authentifizierung gefunden' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extrahiere den JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Initialisiere Supabase-Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Setze den Auth Token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Ungültiger Benutzer oder Token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Profil abrufen
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'Fehler beim Laden des Profils', details: profileError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Überprüfe Profilvollständigkeit
    const incomplete = isProfileIncomplete(profile);

    return new Response(
      JSON.stringify({ 
        profile,
        isComplete: !incomplete,
        redirectRequired: incomplete,
        redirectTo: incomplete ? '/profile' : null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Interner Serverfehler', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

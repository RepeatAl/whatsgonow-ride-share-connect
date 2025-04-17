
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

  // If profile_complete flag is explicitly set to true, trust it
  if (profile.profile_complete === true) return false;

  const { name, region, role, company_name } = profile;

  // Base validation for all users
  if (!name || !region || !role) return true;

  // Role-specific validation
  switch (role) {
    case 'sender_business':
      if (!company_name) return true;
      break;
    case 'cm':
      // Additional CM validation could go here
      break;
    // Add other role-specific validations as needed
  }

  return false;
}

function getMissingProfileFields(profile: UserProfile | null): string[] {
  if (!profile) return ['all fields'];

  const missingFields: string[] = [];
  const { name, region, role, company_name } = profile;

  // Check basic fields all users need
  if (!name) missingFields.push('name');
  if (!region) missingFields.push('region');
  if (!role) missingFields.push('role');

  // Role-specific fields
  if (role === 'sender_business' && !company_name) {
    missingFields.push('company_name');
  }

  return missingFields;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with auth credentials from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Keine Authentifizierung gefunden' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Set auth token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Ungültiger Benutzer oder Token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if profile is complete using SQL function
    const { data: profileCompleteData, error: profileCompleteError } = await supabase
      .rpc('is_profile_complete', { user_id: user.id });
      
    if (profileCompleteError) {
      console.error("Error checking profile completeness:", profileCompleteError);
    }
      
    // Fetch profile anyway for detailed information
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

    // Check profile completeness using both SQL function and JS validation
    const isComplete = profileCompleteData === true || !isProfileIncomplete(profile);
    const missingFields = getMissingProfileFields(profile);

    return new Response(
      JSON.stringify({ 
        profile,
        isComplete: isComplete,
        redirectRequired: !isComplete,
        redirectTo: !isComplete ? '/profile' : null,
        missingFields: missingFields
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

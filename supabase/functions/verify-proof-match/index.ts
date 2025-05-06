
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to extract a QR code from an image URL
// This is a basic implementation for the first phase
const extractQrFromUrl = (url: string): string | null => {
  // Basic implementation: Extract QR code from file name or path
  // Example: if URL contains "qr-XYZ123" in the path, return "XYZ123"
  const qrMatch = url.match(/qr[-_]([A-Za-z0-9_-]+)/i);
  
  if (qrMatch && qrMatch[1]) {
    return qrMatch[1];
  }
  
  // Alternative: check if URL contains a hash-like string
  const hashMatch = url.match(/([a-f0-9]{8,})/i);
  if (hashMatch && hashMatch[1]) {
    return hashMatch[1];
  }
  
  return null;
};

// Helper function to check if a user has admin privileges
const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return data.role === 'admin' || data.role === 'super_admin';
  } catch (err) {
    console.error('Error checking user role:', err);
    return false;
  }
};

// Main request handler
serve(async (req) => {
  // CORS preflight handler
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the JWT from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the JWT from the Authorization header
    const jwt = authHeader.replace('Bearer ', '');
    
    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Ungültiger Authentifizierungstoken' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user has admin privileges
    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Unzureichende Berechtigungen' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const requestData = await req.json();
    const { delivery_log_id } = requestData;

    // Validate input
    if (!delivery_log_id) {
      return new Response(JSON.stringify({ error: 'Fehlende Delivery-Log-ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get delivery log entry
    const { data: deliveryLog, error: fetchError } = await supabaseAdmin
      .from('delivery_logs')
      .select('*')
      .eq('log_id', delivery_log_id)
      .single();

    if (fetchError || !deliveryLog) {
      return new Response(
        JSON.stringify({ error: `Delivery-Log nicht gefunden: ${fetchError?.message || "Unbekannter Fehler"}` }), 
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if already verified
    if (deliveryLog.delivery_verified_at) {
      return new Response(JSON.stringify({ 
        status: "already_verified",
        timestamp: deliveryLog.delivery_verified_at
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    if (!deliveryLog.proof_photo_url || !deliveryLog.qr_hash) {
      return new Response(JSON.stringify({ 
        error: 'Foto-URL oder QR-Hash fehlt', 
        details: {
          has_photo: !!deliveryLog.proof_photo_url,
          has_qr: !!deliveryLog.qr_hash
        }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Extract QR from photo URL
    const extractedQr = extractQrFromUrl(deliveryLog.proof_photo_url);
    
    // Check if QR extraction was successful
    if (!extractedQr) {
      return new Response(JSON.stringify({ 
        status: "verification_failed",
        reason: "qr_not_found",
        message: "Konnte keinen QR-Code im Foto finden"
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Compare QR hash with extracted QR
    const isMatch = deliveryLog.qr_hash.includes(extractedQr) || extractedQr.includes(deliveryLog.qr_hash);
    
    if (!isMatch) {
      return new Response(JSON.stringify({ 
        status: "verification_failed",
        reason: "qr_mismatch",
        message: "QR-Code stimmt nicht mit erwartetem Code überein"
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Store previous state for audit
    const previousState = { ...deliveryLog };
    const timestamp = new Date().toISOString();
    const ipAddress = req.headers.get('X-Forwarded-For') || req.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = req.headers.get('User-Agent') || 'unknown';

    // Update delivery log
    const { error: updateError } = await supabaseAdmin
      .from('delivery_logs')
      .update({
        delivery_verified_at: timestamp,
        verified_by: user.id
      })
      .eq('log_id', delivery_log_id);

    if (updateError) {
      return new Response(JSON.stringify({ 
        error: `Fehler beim Aktualisieren des Delivery-Logs: ${updateError.message}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get updated state
    const { data: newState, error: newStateError } = await supabaseAdmin
      .from('delivery_logs')
      .select('*')
      .eq('log_id', delivery_log_id)
      .single();

    if (newStateError) {
      console.error('Error fetching updated state:', newStateError);
    }

    // Create audit entry
    const { error: auditError } = await supabaseAdmin
      .from('delivery_logs_audit')
      .insert({
        delivery_log_id: delivery_log_id,
        action: 'verified',
        performed_by: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        previous_state: previousState,
        new_state: newState || null
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
    }

    // Also update the order status if available
    if (deliveryLog.order_id) {
      const { error: orderUpdateError } = await supabaseAdmin
        .from('orders')
        .update({ 
          status: 'abgeschlossen',
          verified_at: timestamp 
        })
        .eq('order_id', deliveryLog.order_id);

      if (orderUpdateError) {
        console.error('Error updating order status:', orderUpdateError);
      }
    }

    // Return success response
    return new Response(JSON.stringify({ 
      status: "verified",
      timestamp: timestamp,
      order_id: deliveryLog.order_id || null
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (err) {
    console.error('Unexpected error:', err);
    
    return new Response(JSON.stringify({ 
      error: 'Serverfehler',
      details: err instanceof Error ? err.message : String(err)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

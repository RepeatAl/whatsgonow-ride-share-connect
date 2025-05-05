
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const webhookSecretKey = Deno.env.get("ID_VERIFICATION_WEBHOOK_SECRET") ?? "test_webhook_secret";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Validate webhook signature to ensure it's from our trusted provider
function validateSignature(signature: string, body: string): boolean {
  // In production, this would use crypto to validate HMAC signatures
  // For mock purposes, we'll use a simple validation
  console.log(`Validating signature: ${signature}`);
  
  if (!webhookSecretKey) {
    console.error("Webhook secret key not configured");
    return false;
  }

  // For now, let's simulate successful validation if signature exists
  return signature && signature.length > 0;
}

// Log verification event to the database
async function logVerificationEvent(userId: string, result: string, photoUrl: string, metadata: any): Promise<void> {
  try {
    // Use the SQL function we created to log the event
    const { data, error } = await supabase.rpc(
      'log_id_verification_event',
      {
        p_user_id: userId,
        p_photo_url: photoUrl,
        p_result: result,
        p_source: 'webhook',
        p_metadata: metadata
      }
    );

    if (error) {
      console.error("Error logging verification event:", error);
    } else {
      console.log("Verification event logged successfully:", data);
    }
  } catch (err) {
    console.error("Exception when logging verification event:", err);
  }
}

// Process the verification result and update the user's profile
async function processVerificationResult(userId: string, isVerified: boolean, confidence: number, photoUrl: string) {
  try {
    console.log(`Processing verification result for user ${userId}: ${isVerified ? "Verified" : "Failed"}`);

    // Log the verification event
    await logVerificationEvent(
      userId, 
      isVerified ? "success" : "failed",
      photoUrl,
      { confidence, source: "webhook", timestamp: new Date().toISOString() }
    );

    // Only update the profile if verification was successful
    if (isVerified) {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          id_photo_verified: true,
          id_photo_url: photoUrl
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error processing verification:", error);
    return false;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the signature from the headers
    const signature = req.headers.get("x-webhook-signature") || "";
    
    // Get the request body as text for signature validation
    const bodyText = await req.text();
    
    // Validate the signature
    if (!validateSignature(signature, bodyText)) {
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    // Parse the body JSON
    const eventData = JSON.parse(bodyText);
    console.log("Received webhook event:", eventData);

    // Extract the necessary information
    const { userId, isVerified, confidence, photoUrl } = eventData;

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Process the verification result
    const success = await processVerificationResult(
      userId, 
      isVerified ?? false, 
      confidence ?? 0, 
      photoUrl ?? ""
    );

    return new Response(
      JSON.stringify({ 
        success,
        message: success ? "Verification processed successfully" : "Failed to process verification"
      }),
      { 
        status: success ? 200 : 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});

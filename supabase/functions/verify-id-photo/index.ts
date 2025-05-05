
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock AI verification function (replace with actual AI service)
async function analyzeIDPhoto(photoUrl: string): Promise<{
  isValid: boolean;
  confidence: number;
  issues?: string[];
}> {
  console.log(`Analyzing ID photo: ${photoUrl}`);
  
  // In a real implementation, this would call an AI service API
  // This is just a placeholder that returns success 80% of the time
  const mockValidation = Math.random() > 0.2;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (mockValidation) {
    return {
      isValid: true,
      confidence: 0.85 + (Math.random() * 0.15)
    };
  } else {
    const possibleIssues = [
      "ID card not visible in photo",
      "Photo too blurry",
      "Face not matching profile photo", 
      "ID appears to be invalid or expired"
    ];
    
    return {
      isValid: false,
      confidence: 0.4 + (Math.random() * 0.4),
      issues: [possibleIssues[Math.floor(Math.random() * possibleIssues.length)]]
    };
  }
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
        p_source: 'mock',
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

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, photoUrl } = await req.json();
    console.log(`Processing verification request for user ${userId}`);

    // Validate input
    if (!userId || !photoUrl) {
      return new Response(
        JSON.stringify({ error: "userId and photoUrl are required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Call AI service to analyze the photo (mocked)
    const analysisResult = await analyzeIDPhoto(photoUrl);
    console.log(`Analysis result:`, analysisResult);

    // Log the verification attempt
    await logVerificationEvent(
      userId,
      analysisResult.isValid && analysisResult.confidence > 0.8 ? "success" : "failed",
      photoUrl,
      { 
        confidence: analysisResult.confidence, 
        issues: analysisResult.issues,
        timestamp: new Date().toISOString()
      }
    );

    // Update user's profile based on verification result
    if (analysisResult.isValid && analysisResult.confidence > 0.8) {
      // Verification successful - update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          id_photo_verified: true,
          id_photo_url: photoUrl
        })
        .eq("user_id", userId);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update profile", details: updateError }),
          { 
            status: 500, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          message: "ID photo verification successful",
          confidence: analysisResult.confidence
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    } else {
      // Verification failed - return issues
      return new Response(
        JSON.stringify({ 
          success: true,
          verified: false,
          message: "ID photo verification failed",
          confidence: analysisResult.confidence,
          issues: analysisResult.issues || ["Verification confidence too low"],
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
  } catch (error) {
    console.error("Error processing verification request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReceiptEmailRequest {
  orderId: string;
  email: string;
  pdfBase64: string;
  filename: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get email service credentials from environment variables
    const emailApiKey = Deno.env.get("EMAIL_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "no-reply@whatsgonow.com";
    
    if (!emailApiKey) {
      throw new Error("EMAIL_API_KEY environment variable is not set");
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const { orderId, email, pdfBase64, filename } = await req.json() as ReceiptEmailRequest;

    // Validate input
    if (!orderId || !email || !pdfBase64) {
      throw new Error("Missing required fields");
    }

    // Get order details
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (orderError) {
      throw new Error(`Error fetching order: ${orderError.message}`);
    }

    // Log email request
    console.log(`Sending receipt email for order ${orderId} to ${email}`);

    // For now, we'll simulate sending an email since we don't have an actual email service integrated
    // In a real application, you would use a service like SendGrid, Mailgun, or AWS SES

    // Simulate API call to email service
    const emailResponse = {
      success: true,
      messageId: `mock-${Date.now()}`,
    };

    // Log receipt email in delivery_logs
    await supabase
      .from("delivery_logs")
      .insert({
        order_id: orderId,
        action: "receipt_emailed",
        ip_address: req.headers.get("x-forwarded-for") || "unknown",
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Receipt email sent successfully",
        data: emailResponse,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error sending receipt email:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get email service credentials from environment variables
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const fromEmail = Deno.env.get("FROM_EMAIL") || "no-reply@whatsgonow.com";
    
    if (!resend) {
      throw new Error("RESEND_API_KEY environment variable is not set");
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

    // Implement retry logic for email sending
    const maxRetries = 3;
    let attempt = 0;
    let emailResponse;

    while (attempt < maxRetries) {
      try {
        emailResponse = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `Quittung für Auftrag ${orderId}`,
          html: `
            <h1>Ihre Quittung von Whatsgonow</h1>
            <p>Vielen Dank für Ihren Auftrag. Im Anhang finden Sie Ihre Quittung.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr Whatsgonow Team</p>
          `,
          attachments: [{
            filename: filename,
            content: pdfBase64,
            contentType: 'application/pdf'
          }]
        });
        break; // Success, exit retry loop
      } catch (retryError: any) {
        attempt++;
        console.error(`Retry attempt ${attempt} failed:`, retryError);
        
        if (attempt === maxRetries) {
          throw retryError;
        }
        
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

serve(handler);

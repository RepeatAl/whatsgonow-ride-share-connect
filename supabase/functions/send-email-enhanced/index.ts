
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmailWithRetry = async (emailData: EmailRequest, maxRetries = 3): Promise<any> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[EmailService] Attempt ${attempt}/${maxRetries} for ${emailData.to}`);
      
      const response = await resend.emails.send({
        from: emailData.from || "Whatsgonow <onboarding@resend.dev>",
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        replyTo: emailData.replyTo,
      });

      console.log(`[EmailService] Success on attempt ${attempt}:`, response);
      return response;
      
    } catch (error: any) {
      lastError = error;
      console.error(`[EmailService] Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`[EmailService] Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, text, from, replyTo }: EmailRequest = await req.json();

    // Validation
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateEmail(to)) {
      console.error(`[EmailService] Invalid email format: ${to}`);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!html && !text) {
      return new Response(
        JSON.stringify({ error: "Either html or text content is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if API key is configured
    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error("[EmailService] RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email with retry logic
    const emailResponse = await sendEmailWithRetry({
      to,
      subject,
      html,
      text,
      from,
      replyTo
    });

    // Log success for monitoring
    console.log(`[EmailService] Email sent successfully to ${to}`, {
      id: emailResponse.data?.id,
      subject,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      data: emailResponse.data,
      message: "Email sent successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("[EmailService] Fatal error:", error);
    
    // Log detailed error for debugging
    const errorLog = {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      resend_api_configured: !!Deno.env.get("RESEND_API_KEY")
    };
    
    console.error("[EmailService] Error details:", errorLog);

    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send email",
        details: process.env.NODE_ENV === 'development' ? errorLog : undefined
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

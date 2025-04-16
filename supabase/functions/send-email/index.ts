
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import * as nodemailer from "npm:nodemailer";
import Busboy from "npm:busboy";
import { Resend } from "npm:resend@2.0.0";

// CORS headers to allow cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

// Allowed file types and max file size
const ALLOWED_MIME_TYPES = [
  "application/pdf", 
  "application/xml", 
  "text/xml"
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📧 Email function called with method:", req.method);
    
    // Check if RESEND_API_KEY is set
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error: RESEND_API_KEY not set" 
        }), 
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }
    
    // Parse multipart form data
    const formData = await req.formData();
    console.log("📋 Form data keys:", [...formData.keys()]);
    
    // Extract email details
    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;

    if (!to || !subject || !body) {
      console.error("❌ Missing required fields:", { to: !!to, subject: !!subject, body: !!body });
      return new Response(
        JSON.stringify({ 
          error: "Missing required email fields" 
        }), 
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          } 
        }
      );
    }

    console.log(`📧 Preparing to send email to: ${to}`);

    // Prepare attachments
    const attachments: EmailAttachment[] = [];
    
    // Validate and process attachments
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("attachment_")) {
        const file = value as File;
        console.log(`📎 Processing attachment: ${file.name} (${file.type})`);
        
        // Validate file type and size
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          console.error(`❌ Unsupported file type: ${file.type}`);
          return new Response(
            JSON.stringify({ 
              error: `Unsupported file type: ${file.type}` 
            }), 
            { 
              status: 400, 
              headers: { 
                "Content-Type": "application/json", 
                ...corsHeaders 
              } 
            }
          );
        }

        if (file.size > MAX_FILE_SIZE) {
          console.error(`❌ File size exceeds limit: ${file.size} bytes`);
          return new Response(
            JSON.stringify({ 
              error: "File size exceeds 5MB limit" 
            }), 
            { 
              status: 400, 
              headers: { 
                "Content-Type": "application/json", 
                ...corsHeaders 
              } 
            }
          );
        }

        // Read file content
        const buffer = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(buffer),
          contentType: file.type
        });
        console.log(`✅ Attachment processed: ${file.name}`);
      }
    }

    // Initialize Resend
    console.log("🔑 Initializing Resend with API key");
    const resend = new Resend(apiKey);

    // Implement retry logic for email sending
    const maxRetries = 3;
    let attempt = 0;
    let emailResponse;
    let lastError = null;

    console.log(`🔄 Starting to send email with up to ${maxRetries} retries`);

    while (attempt < maxRetries) {
      try {
        console.log(`📧 Attempt ${attempt + 1} to send email to ${to}`);
        emailResponse = await resend.emails.send({
          from: "Whatsgonow <noreply@whatsgonow.de>",
          to: [to],
          subject: subject,
          html: body,
          attachments: attachments.map(attachment => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType
          }))
        });
        
        console.log(`✅ Email sent successfully on attempt ${attempt + 1}:`, emailResponse);
        break; // Success, exit retry loop
      } catch (retryError: any) {
        attempt++;
        lastError = retryError;
        console.error(`❌ Retry attempt ${attempt} failed:`, retryError);
        
        if (attempt === maxRetries) {
          console.error("❌ All retry attempts failed");
          throw retryError;
        }
        
        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`⏱️ Waiting ${backoffTime}ms before next attempt`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }

    // Return success response
    console.log("📧 Email function completed successfully");
    return new Response(
      JSON.stringify({ 
        status: "sent", 
        to: to,
        messageId: emailResponse?.id || "unknown"
      }), 
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );

  } catch (error: any) {
    console.error("❌ Email sending error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message,
        stack: error.stack
      }), 
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

console.log("📧 Email function initialized and ready to handle requests");
serve(handler);

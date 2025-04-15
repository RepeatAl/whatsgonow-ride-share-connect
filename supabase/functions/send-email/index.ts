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
    // Parse multipart form data
    const formData = await req.formData();
    
    // Extract email details
    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;

    if (!to || !subject || !body) {
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

    // Prepare attachments
    const attachments: EmailAttachment[] = [];
    
    // Validate and process attachments
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("attachment_")) {
        const file = value as File;
        
        // Validate file type and size
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
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
      }
    }

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Implement retry logic for email sending
    const maxRetries = 3;
    let attempt = 0;
    let emailResponse;

    while (attempt < maxRetries) {
      try {
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

    // Return success response
    return new Response(
      JSON.stringify({ 
        status: "sent", 
        to: to,
        messageId: emailResponse.id 
      }), 
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email", 
        details: error.message 
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

serve(handler);

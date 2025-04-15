
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface FeedbackNotificationRequest {
  feedbackId: string;
  title: string;
  content: string;
  feedbackType: string;
  satisfactionRating?: number;
  email?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      feedbackId, 
      title, 
      content, 
      feedbackType, 
      satisfactionRating, 
      email 
    }: FeedbackNotificationRequest = await req.json();

    // Generate admin dashboard URL
    const adminUrl = "https://whatsgonow.app/feedback-admin";
    
    // Create the email HTML content
    const htmlContent = `
      <h1>Neues Feedback eingegangen</h1>
      <p><strong>Feedback-ID:</strong> ${feedbackId}</p>
      <p><strong>Titel:</strong> ${title}</p>
      <p><strong>Typ:</strong> ${feedbackType}</p>
      ${satisfactionRating ? `<p><strong>Zufriedenheitsbewertung:</strong> ${satisfactionRating}/5</p>` : ''}
      ${email ? `<p><strong>E-Mail:</strong> ${email}</p>` : ''}
      <p><strong>Inhalt:</strong> ${content}</p>
      <p>
        <a href="${adminUrl}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
          Zum Feedback-Dashboard
        </a>
      </p>
    `;

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Whatsgonow Feedback <feedback@whatsgonow.app>",
      to: ["admin@whatsgonow.com"],
      subject: "Neues Feedback eingegangen",
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending feedback notification:", error);
    
    // Implement retry logic for transient errors
    if (error.status === 429 || error.status === 503) {
      // You could implement retry logic here
      console.log("Retry logic would be triggered here");
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);

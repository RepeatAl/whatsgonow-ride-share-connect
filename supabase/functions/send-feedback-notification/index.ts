
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FeedbackNotificationRequest {
  adminEmail: string;
  feedbackType: string;
  userEmail: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      adminEmail, 
      feedbackType,
      userEmail,
      message 
    }: FeedbackNotificationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Whatsgonow Feedback <feedback@whatsgonow.com>",
      to: [adminEmail],
      subject: `Neues Feedback: ${feedbackType}`,
      html: `
        <h1>Neues Feedback eingegangen</h1>
        <p><strong>Typ:</strong> ${feedbackType}</p>
        <p><strong>Von:</strong> ${userEmail}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message}</p>
      `
    });

    console.log("Feedback notification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify(emailResponse),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error sending feedback notification:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Fehler beim Versand der Feedback-Benachrichtigung" 
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

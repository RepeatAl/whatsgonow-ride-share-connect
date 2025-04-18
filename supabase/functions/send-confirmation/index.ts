
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type",
};

interface SendConfirmationParams {
  email: string;
  firstName: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export const sendConfirmation = async (params: SendConfirmationParams) => {
  const { email, firstName } = params;

  try {
    const emailResponse = await resend.emails.send({
      from: "Whatsgonow <noreply@whatsgonow.com>",
      to: [email],
      subject: "Willkommen bei whatsgonow!",
      html: `
        <h1>Willkommen bei whatsgonow, ${firstName}!</h1>
        <p>Vielen Dank für deine Voranmeldung. Wir informieren dich, sobald whatsgonow live geht.</p>
        <p>Mit besten Grüßen<br>Dein whatsgonow Team</p>
      `,
    });

    console.log("Confirmation email sent:", emailResponse);
    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName }: SendConfirmationParams = await req.json();
    const result = await sendConfirmation({ email, firstName });
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-confirmation handler:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send confirmation email" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

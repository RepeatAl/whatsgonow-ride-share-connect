
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": 
    "authorization, x-client-info, apikey, content-type, accept-language",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SendConfirmationParams {
  email: string;
  firstName: string;
  language?: string;
}

// Check if Resend API key is available
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set!");
}

const resend = new Resend(resendApiKey);

// Multi-language email templates
const getEmailTemplate = (firstName: string, language: string = "de") => {
  const templates = {
    de: {
      subject: "Willkommen bei whatsgonow!",
      html: `
        <h1>Willkommen bei whatsgonow, ${firstName}!</h1>
        <p>Vielen Dank für deine Voranmeldung. Wir informieren dich, sobald whatsgonow live geht.</p>
        <p>Du hast dich für folgende Bereiche interessiert gezeigt. Wir werden dich entsprechend informieren, wenn diese verfügbar sind.</p>
        <p>Bei Fragen kannst du uns jederzeit kontaktieren.</p>
        <p>Mit besten Grüßen<br>Dein whatsgonow Team</p>
      `
    },
    en: {
      subject: "Welcome to whatsgonow!",
      html: `
        <h1>Welcome to whatsgonow, ${firstName}!</h1>
        <p>Thank you for your pre-registration. We will inform you as soon as whatsgonow goes live.</p>
        <p>You have shown interest in certain areas. We will inform you accordingly when these become available.</p>
        <p>If you have any questions, you can contact us at any time.</p>
        <p>Best regards<br>Your whatsgonow Team</p>
      `
    },
    ar: {
      subject: "مرحباً بك في whatsgonow!",
      html: `
        <h1>مرحباً بك في whatsgonow، ${firstName}!</h1>
        <p>شكراً لك على التسجيل المسبق. سنقوم بإعلامك بمجرد إطلاق whatsgonow.</p>
        <p>لقد أبديت اهتماماً بمجالات معينة. سنقوم بإعلامك عندما تصبح هذه المجالات متاحة.</p>
        <p>إذا كانت لديك أي أسئلة، يمكنك الاتصال بنا في أي وقت.</p>
        <p>مع أطيب التحيات<br>فريق whatsgonow</p>
      `
    }
  };
  
  return templates[language] || templates.de;
};

export const sendConfirmation = async (params: SendConfirmationParams) => {
  const { email, firstName, language = "de" } = params;

  if (!resendApiKey) {
    throw new Error("Email service is not configured - RESEND_API_KEY missing");
  }

  try {
    console.log(`Sending confirmation email to: ${email} in language: ${language}`);

    const template = getEmailTemplate(firstName, language);

    const emailResponse = await resend.emails.send({
      from: "Whatsgonow <noreply@whatsgonow.com>",
      to: [email],
      subject: template.subject,
      html: template.html,
    });

    console.log("Confirmation email sent successfully:", emailResponse);
    return { success: true, messageId: emailResponse.id };
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
    const body = await req.json();
    console.log("Received confirmation request:", body);
    
    const { email, firstName, language = "de" }: SendConfirmationParams = body;
    
    // Validate inputs
    if (!email || !firstName) {
      const errorMsg = "Missing required fields: email or firstName";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMsg = "Invalid email format";
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const result = await sendConfirmation({ email, firstName, language });
    console.log("Email sending result:", result);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in send-confirmation handler:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to send confirmation email" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

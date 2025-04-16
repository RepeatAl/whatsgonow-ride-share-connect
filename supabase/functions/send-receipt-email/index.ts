
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReceiptEmailRequest {
  orderId: string;
  email: string;
  pdfBase64: string;
  filename: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      pdfBase64,
      filename,
      orderId 
    }: ReceiptEmailRequest = await req.json();

    const pdfAttachment = Buffer.from(pdfBase64, 'base64');

    const emailResponse = await resend.emails.send({
      from: "Whatsgonow Quittungen <receipts@whatsgonow.com>",
      to: [email],
      subject: `Whatsgonow Quittung für Auftrag #${orderId}`,
      html: `
        <h1>Ihre Quittung von Whatsgonow</h1>
        <p>Sehr geehrte(r) Kunde/Kundin,</p>
        <p>vielen Dank für die Nutzung von Whatsgonow.</p>
        <p>Im Anhang finden Sie Ihre Quittung für den Auftrag #${orderId}.</p>
        <p>Mit freundlichen Grüßen<br>Ihr Whatsgonow Team</p>
      `,
      attachments: [
        {
          filename: filename,
          content: pdfAttachment
        }
      ]
    });

    console.log("Receipt email sent successfully:", emailResponse);

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
    console.error("Error sending receipt email:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Fehler beim Versand der Quittung" 
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

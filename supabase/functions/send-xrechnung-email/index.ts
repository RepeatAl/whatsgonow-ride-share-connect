
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface XRechnungEmailRequest {
  invoiceId: string;
  recipientEmail: string;
  recipientName: string;
  orderNumber: string;
  xmlBase64: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      recipientEmail, 
      recipientName,
      orderNumber,
      xmlBase64 
    }: XRechnungEmailRequest = await req.json();

    const xmlAttachment = Buffer.from(xmlBase64, 'base64');

    const emailResponse = await resend.emails.send({
      from: "Whatsgonow XRechnung <xrechnung@whatsgonow.com>",
      to: [recipientEmail],
      subject: `Whatsgonow XRechnung #${orderNumber}`,
      html: `
        <h1>Ihre XRechnung von Whatsgonow</h1>
        <p>${recipientName},</p>
        <p>im Anhang finden Sie die XRechnung für den Auftrag #${orderNumber} im standardisierten Format.</p>
        <p>Mit freundlichen Grüßen<br>Ihr Whatsgonow Team</p>
      `,
      attachments: [
        {
          filename: `XRechnung-${orderNumber}.xml`,
          content: xmlAttachment
        }
      ]
    });

    console.log("XRechnung email sent successfully:", emailResponse);

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
    console.error("Error sending XRechnung email:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Fehler beim Versand der XRechnung" 
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

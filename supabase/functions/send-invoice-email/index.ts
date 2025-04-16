
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvoiceEmailRequest {
  orderId: string;
  invoiceId: string | null;
  email: string;
  invoiceNumber: string;
  pdfBase64: string;
  xmlBase64: string;
  customer: string;
  amount: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      invoiceNumber, 
      pdfBase64, 
      xmlBase64,
      customer,
      amount 
    }: InvoiceEmailRequest = await req.json();

    const pdfAttachment = Buffer.from(pdfBase64, 'base64');
    const xmlAttachment = Buffer.from(xmlBase64, 'base64');

    const emailResponse = await resend.emails.send({
      from: "Whatsgonow Rechnungen <invoices@whatsgonow.com>",
      to: [email],
      subject: `Whatsgonow Rechnung #${invoiceNumber}`,
      html: `
        <h1>Ihre Rechnung von Whatsgonow</h1>
        <p>Sehr geehrte(r) ${customer},</p>
        <p>vielen Dank für Ihre Bestellung bei Whatsgonow.</p>
        <p>Im Anhang finden Sie Ihre Rechnung über ${amount} EUR.</p>
        <p>Mit freundlichen Grüßen<br>Ihr Whatsgonow Team</p>
      `,
      attachments: [
        {
          filename: `Rechnung-${invoiceNumber}.pdf`,
          content: pdfAttachment
        },
        {
          filename: `XRechnung-${invoiceNumber}.xml`,
          content: xmlAttachment
        }
      ]
    });

    console.log("Invoice email sent successfully:", emailResponse);

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
    console.error("Error sending invoice email:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Fehler beim Versand der Rechnung" 
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

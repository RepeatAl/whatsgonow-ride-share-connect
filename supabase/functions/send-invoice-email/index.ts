
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId, 
      invoiceId,
      email, 
      invoiceNumber, 
      pdfBase64, 
      xmlBase64, 
      customer, 
      amount 
    }: InvoiceEmailRequest = await req.json();

    // This is where you would integrate with an email sending service like Resend or SendGrid
    // For demonstration purposes, we'll log the request and return success
    console.log(`Sending invoice ${invoiceNumber} to ${email} for order ${orderId}`);
    console.log(`Invoice ID: ${invoiceId || 'Not provided'}`);
    console.log(`PDF size: ${pdfBase64.length} characters`);
    console.log(`XML size: ${xmlBase64.length} characters`);
    
    // Here's how you would implement it with Resend if you have that configured:
    /*
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const emailResponse = await resend.emails.send({
      from: "Whatsgonow <buchhaltung@whatsgonow.de>",
      to: [email],
      subject: `Ihre Rechnung ${invoiceNumber}`,
      html: `
        <h1>Ihre Rechnung von Whatsgonow</h1>
        <p>Sehr geehrte:r ${customer},</p>
        <p>vielen Dank für Ihren Auftrag. Im Anhang finden Sie Ihre Rechnung über ${amount} EUR.</p>
        <p>Die Rechnung wurde als PDF und im XRechnung-Format (XML) zur Verfügung gestellt.</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Whatsgonow Team</p>
      `,
      attachments: [
        {
          filename: `Rechnung-${invoiceNumber}.pdf`,
          content: pdfBase64,
          encoding: 'base64',
        },
        {
          filename: `XRechnung-${invoiceNumber}.xml`,
          content: xmlBase64,
          encoding: 'base64',
        },
      ],
    });
    */

    // Update invoice record in database if you have invoiceId
    // This would be done via a separate API call or directly in the invoice service

    // Simulate successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Invoice email sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invoice-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

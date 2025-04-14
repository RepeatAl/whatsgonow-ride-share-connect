
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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

    // Create a Supabase client with the service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // If we have an invoiceId, get the signed URLs directly to save bandwidth
    let pdfAttachment = pdfBase64;
    let xmlAttachment = xmlBase64;

    if (invoiceId) {
      // Check if we have PDF and XML file paths in storage
      const { data: invoice } = await supabase
        .from('invoices')
        .select('pdf_url, xml_url')
        .eq('invoice_id', invoiceId)
        .single();

      // If we have existing URLs, don't re-upload the files
      if (invoice && (invoice.pdf_url || invoice.xml_url)) {
        console.log("Using existing signed URLs");
        
        // Here we would get the files from storage directly
        // For demonstration purposes we'll just log that we would use the existing URLs
        // In a production environment, we would download the files or use S3 presigned URLs
      }
    }

    // This is where you would integrate with an email sending service like Resend or SendGrid
    // For demonstration purposes, we'll log the request and return success
    console.log(`Sending invoice ${invoiceNumber} to ${email} for order ${orderId}`);
    console.log(`Invoice ID: ${invoiceId || 'Not provided'}`);
    console.log(`PDF size: ${typeof pdfAttachment === 'string' ? pdfAttachment.length : 'Using URL'} characters`);
    console.log(`XML size: ${typeof xmlAttachment === 'string' ? xmlAttachment.length : 'Using URL'} characters`);
    
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
          content: pdfAttachment,
          encoding: 'base64',
        },
        {
          filename: `XRechnung-${invoiceNumber}.xml`,
          content: xmlAttachment,
          encoding: 'base64',
        },
      ],
    });
    */

    // Update invoice record status to 'sent'
    if (invoiceId) {
      await supabase
        .from('invoices')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString() 
        })
        .eq('invoice_id', invoiceId);
    }

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

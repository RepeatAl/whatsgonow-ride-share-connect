
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
  xmlBase64?: string;
}

// List of government email domains that should receive XRechnungen
const GOVERNMENT_DOMAINS = [
  "@bdr.de", 
  "@bund.de", 
  "@bundesregierung.de", 
  "@bundeswehr.org", 
  "@zoll.de",
  "@bzst.de",
  "@bafa.de"
];

// Function to check if an email belongs to a government agency
function isGovernmentEmail(email: string): boolean {
  return GOVERNMENT_DOMAINS.some(domain => email.toLowerCase().endsWith(domain));
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      invoiceId, 
      recipientEmail, 
      recipientName, 
      orderNumber,
      xmlBase64
    }: XRechnungEmailRequest = await req.json();

    // Check if the recipient is a government agency
    if (!isGovernmentEmail(recipientEmail)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Recipient is not a government agency. XRechnung not sent." 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // If xmlBase64 is not provided, fetch the XML file from storage
    let xmlAttachment = xmlBase64;
    
    if (!xmlAttachment) {
      // Get the invoice XML URL from the database
      const { data: invoice } = await supabase
        .from('invoices')
        .select('xml_url')
        .eq('invoice_id', invoiceId)
        .single();

      if (invoice?.xml_url) {
        console.log("Using existing XML from storage:", invoice.xml_url);
        
        // Here we would get the XML from storage
        // For demonstration, we'll just log that we would use the URL
        // In production, we would download the file or get a presigned URL
      } else {
        // If XML URL doesn't exist, generate a new XML
        console.log("Generating new XML for invoice:", invoiceId);

        // In a real implementation, you would call an API to generate the XML
        // and then convert it to base64 for email attachment
      }
    }

    // Log the email sending attempt
    console.log(`Sending XRechnung to government agency: ${recipientEmail} for invoice ${invoiceId}`);
    
    // Here we would integrate with an email sending service
    // For example, using SMTP via nodemailer directly or calling the send-email edge function

    // Example of how we would call another edge function to send the email
    const emailResponse = await fetch('https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        to: recipientEmail,
        subject: `XRechnung für Auftrag ${orderNumber}`,
        body: `Sehr geehrte/r ${recipientName},

im Anhang finden Sie die XRechnung für den Auftrag ${orderNumber}. 

Diese XRechnung entspricht dem Standard für elektronische Rechnungen an öffentliche Auftraggeber und kann direkt in Ihrem System verarbeitet werden.

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen,
Whatsgonow GmbH`,
        attachment_1: {
          filename: `XRechnung-${orderNumber}.xml`,
          content: xmlAttachment,
          contentType: 'application/xml'
        }
      })
    });

    // Update invoice record status to 'sent_to_government'
    await supabase
      .from('invoices')
      .update({ 
        status: 'sent_to_government',
        sent_at: new Date().toISOString(),
        xrechnung_sent: true
      })
      .eq('invoice_id', invoiceId);

    // Add entry to audit log
    await supabase
      .from('invoice_audit_log')
      .insert({
        invoice_id: invoiceId,
        action: 'xrechnung_email_sent',
        new_state: { recipient: recipientEmail, sent_at: new Date().toISOString() }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "XRechnung email sent successfully to government agency",
        recipient: recipientEmail
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
    console.error("Error in send-xrechnung-email function:", error);
    
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

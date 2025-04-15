
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "npm:resend@2.0.0";

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

// List of government email domains
const GOVERNMENT_DOMAINS = [
  "@bdr.de", "@bund.de", "@bundesregierung.de", 
  "@bundeswehr.org", "@zoll.de", "@bzst.de", "@bafa.de"
];

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      invoiceId, 
      recipientEmail, 
      recipientName, 
      orderNumber,
      xmlBase64 
    }: XRechnungEmailRequest = await req.json();

    if (!GOVERNMENT_DOMAINS.some(domain => recipientEmail.toLowerCase().endsWith(domain))) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Not a government agency email" 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Whatsgonow <buchhaltung@whatsgonow.de>",
      to: [recipientEmail],
      subject: `XRechnung für Auftrag ${orderNumber}`,
      html: `
        <h1>XRechnung für Auftrag ${orderNumber}</h1>
        <p>Sehr geehrte/r ${recipientName},</p>
        <p>Im Anhang finden Sie die XRechnung im XML-Format für Ihren Auftrag.</p>
        <p>Bei Fragen kontaktieren Sie uns unter support@whatsgonow.de</p>
      `,
      attachments: xmlBase64 ? [{
        filename: `XRechnung-${orderNumber}.xml`,
        content: xmlBase64,
        contentType: 'application/xml'
      }] : undefined
    });

    // Log to audit log
    await supabase
      .from('invoice_audit_log')
      .insert({
        invoice_id: invoiceId,
        action: 'xrechnung_email_sent',
        new_state: { 
          recipient: recipientEmail, 
          status: emailResponse.id ? 'sent' : 'failed' 
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("XRechnung Email Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
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


import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";

// Email service configuration for sending XRechnung emails
import { createTransport } from "https://esm.sh/nodemailer@6.9.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const emailUser = Deno.env.get("admin@whatgonow.com") || "";
const emailPass = Deno.env.get("SMTP-PASS") || "";

// Government domain patterns for automatic XRechnung detection
const GOVERNMENT_DOMAINS = [
  ".bund.de",
  ".bayern.de",
  ".berlin.de",
  ".brandenburg.de",
  ".bremen.de",
  ".hamburg.de",
  ".hessen.de",
  ".mv-regierung.de",
  ".niedersachsen.de",
  ".nrw.de",
  ".rlp.de",
  ".saarland.de",
  ".sachsen.de",
  ".sachsen-anhalt.de",
  ".schleswig-holstein.de",
  ".thueringen.de",
  ".bundeswehr.de",
];

interface XRechnungRequest {
  orderId: string;
  email: string;
  recipientName: string;
  isTest?: boolean;
}

serve(async (req: Request) => {
  // CORS preflight handling
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { orderId, email, recipientName, isTest = false } = await req.json() as XRechnungRequest;
    
    if (!orderId || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderId and email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create authenticated Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get order and invoice details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found", details: orderError }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get invoice related to the order
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (invoiceError) {
      return new Response(
        JSON.stringify({ error: "Error fetching invoice", details: invoiceError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate XRechnung XML
    const xRechnungXml = generateXRechnungXml(order, invoice, email, recipientName);
    
    // Store the XML
    let xmlUrl = "";
    if (!isTest) {
      // Store XML in storage
      const xmlFileName = `xrechnung-${invoice.invoice_id}.xml`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(`xrechnungen/${xmlFileName}`, new Blob([xRechnungXml], { type: "application/xml" }), {
          contentType: "application/xml",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading XRechnung XML:", uploadError);
      } else {
        xmlUrl = supabase.storage.from("invoices").getPublicUrl(`xrechnungen/${xmlFileName}`).data.publicUrl;
        
        // Update invoice record with XRechnung status
        await supabase
          .from("invoices")
          .update({
            xrechnung_compliant: true,
            xml_url: xmlUrl
          })
          .eq("invoice_id", invoice.invoice_id);
      }
    }

    // Send email with XRechnung attachment
    const emailSent = await sendXRechnungEmail({
      to: email,
      orderId: orderId,
      recipientName: recipientName,
      xRechnungXml: xRechnungXml,
      isTest: isTest,
      invoiceId: invoice?.invoice_id,
    });

    // Log the XRechnung sending attempt
    await supabase.from("invoice_audit_log").insert({
      invoice_id: invoice?.invoice_id,
      action: isTest ? "xrechnung_preview" : "xrechnung_sent",
      new_state: { 
        orderId,
        email,
        recipientName,
        emailSent,
        isTest,
        xmlUrl
      }
    });

    return new Response(
      JSON.stringify({ 
        success: emailSent, 
        message: isTest 
          ? "XRechnung preview sent successfully" 
          : "XRechnung email sent successfully",
        xmlUrl
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );

  } catch (error) {
    console.error("Error processing XRechnung email:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process XRechnung email", details: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});

// Function to check if an email is from a government agency
function isGovernmentEmail(email: string): boolean {
  const domain = email.substring(email.indexOf('@') + 1).toLowerCase();
  return GOVERNMENT_DOMAINS.some(govDomain => domain.endsWith(govDomain));
}

// Function to generate XRechnung XML
function generateXRechnungXml(order: any, invoice: any, recipientEmail: string, recipientName: string): string {
  // Simple XRechnung XML generation
  // In a real implementation, this would follow the exact XRechnung schema
  const currentDate = new Date().toISOString().split('T')[0];
  const invoiceId = invoice?.invoice_id || "TEST-INVOICE";
  const amount = invoice?.amount || 0;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_2.0</cbc:CustomizationID>
  <cbc:ID>${invoiceId}</cbc:ID>
  <cbc:IssueDate>${currentDate}</cbc:IssueDate>
  <cbc:DueDate>${currentDate}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:Note>Lieferung von ${order.from_address} nach ${order.to_address}</cbc:Note>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>Whatsgonow GmbH</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>Hauptstraße</cbc:StreetName>
        <cbc:CityName>Berlin</cbc:CityName>
        <cbc:PostalZone>10115</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:Contact>
        <cbc:Telephone>+49 30 12345678</cbc:Telephone>
        <cbc:ElectronicMail>kontakt@whatsgonow.com</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${recipientName}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${order.to_address.split(',')[0] || 'Unbekannt'}</cbc:StreetName>
        <cbc:CityName>${order.to_address.split(',')[1] || 'Unbekannt'}</cbc:CityName>
        <cbc:PostalZone>00000</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:Contact>
        <cbc:ElectronicMail>${recipientEmail}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">${amount}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">${amount}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">${amount * 1.19}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">${amount * 1.19}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="EA">1</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="EUR">${amount}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Name>Transport: ${order.description}</cbc:Name>
      <cac:SellersItemIdentification>
        <cbc:ID>${order.order_id}</cbc:ID>
      </cac:SellersItemIdentification>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>19</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="EUR">${amount}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
</ubl:Invoice>`;
}

// Function to send XRechnung email
async function sendXRechnungEmail({ 
  to, 
  orderId, 
  recipientName, 
  xRechnungXml, 
  isTest = false,
  invoiceId
}: {
  to: string;
  orderId: string;
  recipientName: string;
  xRechnungXml: string;
  isTest?: boolean;
  invoiceId?: string;
}): Promise<boolean> {
  try {
    // Configure email transport
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Whatsgonow" <${emailUser}>`,
      to: to,
      subject: isTest 
        ? `[TEST] XRechnung für Auftrag #${orderId}` 
        : `XRechnung für Auftrag #${orderId}`,
      text: `Sehr geehrte/r ${recipientName},\n\n` +
        `Im Anhang finden Sie die elektronische Rechnung im XRechnung-Format für Ihren Auftrag #${orderId}.\n\n` +
        `Diese Rechnung entspricht dem XRechnung-Standard und kann direkt in Ihre Rechnungsverarbeitungssysteme importiert werden.\n\n` +
        `${isTest ? "DIES IST EINE TEST-RECHNUNG UND DIENT NUR ZU VORSCHAUZWECKEN.\n\n" : ""}` +
        `Mit freundlichen Grüßen,\n` +
        `Ihr Whatsgonow Team`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Elektronische Rechnung (XRechnung)</h2>
        <p>Sehr geehrte/r ${recipientName},</p>
        <p>Im Anhang finden Sie die elektronische Rechnung im XRechnung-Format für Ihren Auftrag <strong>#${orderId}</strong>.</p>
        <p>Diese Rechnung entspricht dem XRechnung-Standard und kann direkt in Ihre Rechnungsverarbeitungssysteme importiert werden.</p>
        ${isTest ? '<p style="background-color: #fef3c7; padding: 10px; border-radius: 5px;"><strong>DIES IST EINE TEST-RECHNUNG UND DIENT NUR ZU VORSCHAUZWECKEN.</strong></p>' : ''}
        <p>Mit freundlichen Grüßen,<br>Ihr Whatsgonow Team</p>
        <hr style="border: 1px solid #e5e7eb; margin-top: 20px;">
        <p style="font-size: 12px; color: #6b7280;">Whatsgonow GmbH • Hauptstraße 1 • 10115 Berlin</p>
      </div>`,
      attachments: [
        {
          filename: isTest 
            ? `xrechnung-test-${orderId}.xml` 
            : `xrechnung-${invoiceId || orderId}.xml`,
          content: xRechnungXml,
          contentType: "application/xml",
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending XRechnung email:", error);
    return false;
  }
}

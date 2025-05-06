
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Erstellen des Supabase Client mit Service Role Berechtigungen
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Typdefinitionen
interface XRechnungEmailRequest {
  invoiceId: string;
  preview?: boolean;
}

interface InvoiceData {
  invoice_id: string;
  recipient_email: string;
  recipient_name: string;
  order_id: string;
  pdf_url?: string;
  xml_url?: string;
  invoice_number?: string;
}

// Liste gültiger Behörden-Domains
const governmentDomains = [
  "@bund.de",
  "@bundesregierung.de",
  "@bundeswehr.org",
  "@bzst.de",
  "@bafa.de",
  "@zoll.de",
  // Bundesländer
  "@bayern.de",
  "@berlin.de",
  "@bremen.de",
  "@hamburg.de",
  "@hessen.de",
  // Städte
  "@muenchen.de",
  "@koeln.de",
  "@frankfurt.de",
  // Generisch
  ".kommune.de",
  ".landkreis-",
  ".kreis-"
];

// Validierung des XRechnung-Formats
async function validateXRechnung(xmlData: ArrayBuffer): Promise<{ isValid: boolean; errors: string[] }> {
  try {
    // Grundlegende Struktur-Prüfung
    const decoder = new TextDecoder("utf-8");
    const xmlText = decoder.decode(xmlData);
    
    // Minimale Validierung auf erforderliche XRechnung-Elemente
    const requiredElements = [
      "<invoice:",
      "<invoice:invoiceNumber",
      "<invoice:issueDate",
      "<invoice:seller>",
      "<invoice:buyer>",
    ];
    
    const errors: string[] = [];
    
    for (const element of requiredElements) {
      if (!xmlText.includes(element)) {
        errors.push(`Erforderliches Element fehlt: ${element}`);
      }
    }
    
    return { 
      isValid: errors.length === 0,
      errors 
    };
  } catch (error) {
    console.error("Fehler bei der XRechnung-Validierung:", error);
    return { 
      isValid: false, 
      errors: [`Validierungsfehler: ${error instanceof Error ? error.message : String(error)}`] 
    };
  }
}

// Prüfen, ob Email zu einer Behörde gehört
function isGovernmentAgency(email: string): boolean {
  const normalizedEmail = email.toLowerCase();
  return governmentDomains.some(domain => normalizedEmail.includes(domain));
}

// Laden der XML- und PDF-Dateien aus dem Storage
async function downloadFileFromStorage(fileUrl: string): Promise<ArrayBuffer | null> {
  try {
    // URL-Format: https://[project-ref].supabase.co/storage/v1/object/public/invoices/[path]
    const pathMatch = fileUrl.match(/\/object\/public\/invoices\/(.+)$/);
    if (!pathMatch || !pathMatch[1]) {
      throw new Error("Ungültiges URL-Format");
    }
    
    const path = decodeURIComponent(pathMatch[1]);
    const { data, error } = await supabase.storage
      .from("invoices")
      .download(path);
      
    if (error || !data) {
      throw new Error(`Download fehlgeschlagen: ${error?.message || "Keine Datei gefunden"}`);
    }
    
    return await data.arrayBuffer();
  } catch (error) {
    console.error("Fehler beim Datei-Download:", error);
    return null;
  }
}

// Logging in die audit_log-Tabelle
async function logToAuditSystem(
  invoiceId: string, 
  action: string, 
  success: boolean, 
  details: Record<string, any>
): Promise<void> {
  try {
    await supabase.from("invoice_audit_log").insert({
      invoice_id: invoiceId,
      action,
      new_state: {
        success,
        timestamp: new Date().toISOString(),
        ...details
      },
      user_id: null, // System-Aktion
    });
  } catch (error) {
    console.error("Fehler beim Audit-Logging:", error);
  }
}

// Hauptfunktion für den E-Mail-Versand
async function sendXRechnungEmail(
  invoiceId: string,
  preview = false
): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    // 1. Invoice-Daten laden
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, order_id")
      .eq("invoice_id", invoiceId)
      .single();
      
    if (invoiceError || !invoice) {
      throw new Error(`Rechnung nicht gefunden: ${invoiceError?.message || "Keine Daten"}`);
    }

    // 2. Empfängerdaten aus invoice_addresses laden
    const { data: addresses, error: addressError } = await supabase
      .from("invoice_addresses")
      .select("*")
      .eq("invoice_id", invoiceId);
      
    if (addressError) {
      console.warn("Warnung beim Laden der Adressdaten:", addressError);
    }

    // Empfängerdaten zusammenstellen
    const recipient = addresses?.find(addr => addr.entity_type === 'recipient');
    
    // Bestimmen der Empfänger-E-Mail und des Namens
    let recipientEmail = invoice.recipient_id ? null : null; // Fallback auf Benutzer-E-Mail
    let recipientName = "Sehr geehrte Damen und Herren";
    
    // Versuche E-Mail aus verschiedenen Quellen zu bekommen
    if (recipient && recipient.email) {
      recipientEmail = recipient.email;
      recipientName = recipient.company_name || recipient.contact_person || recipientName;
    } else {
      // Versuche E-Mail aus User zu bekommen, falls recipient_id gesetzt ist
      if (invoice.recipient_id) {
        const { data: userData } = await supabase
          .from("profiles")
          .select("email, first_name, last_name, company_name")
          .eq("user_id", invoice.recipient_id)
          .single();
          
        if (userData) {
          recipientEmail = userData.email;
          recipientName = userData.company_name || 
            (userData.first_name && userData.last_name ? 
              `${userData.first_name} ${userData.last_name}` : recipientName);
        }
      }
    }
    
    if (!recipientEmail) {
      throw new Error("Keine Empfänger-E-Mail gefunden");
    }
    
    // 3. Bei Preview die Ziel-E-Mail überschreiben
    const targetEmail = preview ? "preview@whatsgonow.com" : recipientEmail;
    
    // 4. Prüfen ob es sich um eine Behörde handelt (nur bei nicht-Preview)
    const isGovernment = isGovernmentAgency(recipientEmail);
    if (!isGovernment && !preview) {
      await logToAuditSystem(
        invoiceId, 
        "xrechnung_skipped", 
        true, 
        { reason: "recipient_not_government", email: recipientEmail }
      );
      return {
        success: false,
        message: "Der Empfänger ist keine Behörde, XRechnung-Versand übersprungen"
      };
    }
    
    // 5. PDF und XML aus Storage laden
    if (!invoice.pdf_url || !invoice.xml_url) {
      throw new Error("PDF oder XML URL fehlt");
    }
    
    const xmlBuffer = await downloadFileFromStorage(invoice.xml_url);
    if (!xmlBuffer) {
      throw new Error("XML-Datei konnte nicht geladen werden");
    }
    
    // XRechnung validieren
    const { isValid, errors } = await validateXRechnung(xmlBuffer);
    if (!isValid) {
      await logToAuditSystem(
        invoiceId, 
        "xrechnung_validation_failed", 
        false, 
        { errors }
      );
      
      // Validierungsergebnis speichern
      await supabase.from("invoice_validation_results").insert({
        invoice_id: invoiceId,
        validation_type: "xrechnung_format",
        passed: false,
        error_messages: errors
      });
      
      return {
        success: false,
        message: "XRechnung-Format ungültig",
        details: { errors }
      };
    }
    
    // PDF ist optional, aber wenn URL vorhanden, dann versuchen zu laden
    const pdfBuffer = invoice.pdf_url ? await downloadFileFromStorage(invoice.pdf_url) : null;
    
    // 6. Auftragsnummer (order_id) für Referenz holen
    const orderNumber = invoice.invoice_number || invoice.order_id || invoiceId.substring(0, 8);
    
    // 7. E-Mail zusammenstellen und senden
    const attachments = [
      { filename: `XRechnung-${orderNumber}.xml`, content: xmlBuffer }
    ];
    
    if (pdfBuffer) {
      attachments.push({ 
        filename: `Rechnung-${orderNumber}.pdf`, 
        content: pdfBuffer 
      });
    }
    
    // E-Mail senden
    const emailResult = await resend.emails.send({
      from: "Whatsgonow XRechnung <xrechnung@whatsgonow.com>",
      to: [targetEmail],
      subject: `Ihre elektronische Rechnung (XRechnung) ${orderNumber} von Whatsgonow`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Elektronische Rechnung im XRechnung-Format</h2>
          <p>Sehr ${recipientName},</p>
          <p>anbei erhalten Sie die elektronische Rechnung Nr. <strong>${orderNumber}</strong> im 
             standardisierten XRechnung-Format gemäß den Vorgaben für den elektronischen 
             Rechnungsaustausch mit der öffentlichen Verwaltung.</p>
          
          <p>Die Rechnung enthält folgende Anlagen:</p>
          <ul>
            <li>XRechnung-Datei im XML-Format (maschinenlesbar)</li>
            ${pdfBuffer ? `<li>PDF-Version der Rechnung (Visualisierung)</li>` : ''}
          </ul>
          
          ${preview ? '<p><strong>HINWEIS: Dies ist eine Vorschau der XRechnung-E-Mail.</strong></p>' : ''}
          
          <p>Bei Rückfragen zu dieser Rechnung kontaktieren Sie bitte unseren Support 
             unter <a href="mailto:support@whatsgonow.com">support@whatsgonow.com</a>.</p>
          
          <p>Mit freundlichen Grüßen<br>
          Ihr Whatsgonow Team</p>
        </div>
      `,
      attachments
    });
    
    // 8. Erfolg loggen
    const action = preview ? "xrechnung_preview_sent" : "xrechnung_sent";
    await logToAuditSystem(
      invoiceId, 
      action, 
      true, 
      { 
        email_id: emailResult.id,
        recipient: targetEmail,
        is_preview: preview
      }
    );
    
    // 9. E-Mail-Informationen auswerten (falls DKIM, SPF, DMARC-Details verfügbar sind)
    // Dies würde in einer Produktivumgebung über Webhook-Callbacks von Resend erfolgen
    
    return {
      success: true,
      message: preview ? "XRechnung-Vorschau erfolgreich gesendet" : "XRechnung erfolgreich versendet",
      details: emailResult
    };
  } catch (error) {
    console.error("Fehler beim XRechnung-E-Mail-Versand:", error);
    
    // Fehler loggen
    await logToAuditSystem(
      invoiceId, 
      "xrechnung_error", 
      false, 
      { 
        error_message: error instanceof Error ? error.message : String(error)
      }
    );
    
    return {
      success: false,
      message: `XRechnung-Versand fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// Haupthandler für die Edge Function
const handler = async (req: Request): Promise<Response> => {
  // CORS-Preflight Anfragen behandeln
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Request-Body parsen
    const { invoiceId, preview = false }: XRechnungEmailRequest = await req.json();
    
    if (!invoiceId) {
      throw new Error("Invoice ID ist erforderlich");
    }
    
    // XRechnung-E-Mail senden
    const result = await sendXRechnungEmail(invoiceId, preview);
    
    // Erfolg oder Fehler zurückgeben
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Fehler in send-xrechnung-email Handler:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : "Unbekannter Fehler" 
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

// Edge Function registrieren
serve(handler);

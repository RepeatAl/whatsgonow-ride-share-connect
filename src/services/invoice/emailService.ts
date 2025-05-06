
import { supabase } from '@/lib/supabaseClient';
import { prepareInvoiceData } from '@/utils/invoice';
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { xRechnungService } from './xRechnungService';
import { blobToBase64 } from './helpers';
import { toast } from "@/hooks/use-toast";

/**
 * Service für den Umgang mit Rechnungs-E-Mail-Operationen
 */
export const emailService = {
  /**
   * Rechnung per E-Mail versenden
   */
  sendInvoiceEmail: async (orderId: string, email: string): Promise<boolean> => {
    try {
      // PDF und XML generieren
      const pdfBlob = await pdfService.generatePDF(orderId);
      const xmlBlob = await xmlService.generateXML(orderId);
      const invoiceData = await prepareInvoiceData(orderId);
      
      // Blobs in Base64 konvertieren
      const pdfBase64 = await blobToBase64(pdfBlob);
      const xmlBase64 = await blobToBase64(xmlBlob);
      
      if (!pdfBase64 || !xmlBase64) {
        throw new Error("Fehler bei der Konvertierung der Dateien");
      }
      
      // Rechnungs-ID suchen, falls verfügbar
      const { data: invoice } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
      
      // Supabase Edge Function aufrufen, um E-Mail mit Anhängen zu versenden
      const { data, error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          orderId,
          invoiceId: invoice?.invoice_id || null,
          email,
          invoiceNumber: invoiceData.invoiceNumber,
          pdfBase64,
          xmlBase64,
          customer: invoiceData.recipient.name,
          amount: invoiceData.total.toFixed(2),
        }
      });
      
      if (error) throw error;
      
      // Rechnungsstatus aktualisieren, falls verfügbar
      if (invoice?.invoice_id) {
        await supabase
          .from('invoices')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('invoice_id', invoice.invoice_id);
      }
      
      toast({
        title: "Erfolg",
        description: "Die Rechnung wurde per E-Mail versendet."
      });
      
      // Prüfen, ob Empfänger eine Behörde ist und ggf. XRechnung versenden
      if (xRechnungService.isGovernmentAgency(email)) {
        // Kurze Wartezeit, um Rate-Limiting zu vermeiden
        setTimeout(async () => {
          try {
            await xRechnungService.sendXRechnungEmail({
              orderId, 
              email, 
              recipientName: invoiceData.recipient.name
            });
          } catch (xRechnungError) {
            console.error("Fehler beim Senden der XRechnung nach normaler Rechnung:", xRechnungError);
          }
        }, 2000);
      }
      
      return true;
    } catch (error) {
      console.error("Fehler beim Senden der Rechnungs-E-Mail:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht per E-Mail versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Rechnung per SMS versenden
   */
  sendInvoiceSMS: async (
    invoiceId: string, 
    recipientPhone: string, 
    includePin: boolean = false
  ): Promise<boolean> => {
    try {
      // SMS-Edge-Function aufrufen
      const { data, error } = await supabase.functions.invoke('send-invoice-sms', {
        body: {
          invoiceId: invoiceId,
          recipientPhone,
          includePin
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "SMS versendet",
        description: "Die Rechnungs-Benachrichtigung wurde per SMS gesendet."
      });
      
      return true;
    } catch (error) {
      console.error("Fehler beim Versenden der Rechnungs-SMS:", error);
      toast({
        title: "Fehler",
        description: "Die SMS konnte nicht versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  }
};

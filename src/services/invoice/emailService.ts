
import { supabase } from '@/lib/supabaseClient';
import { prepareInvoiceData } from '@/utils/invoice';
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { blobToBase64 } from './helpers';
import { toast } from "@/hooks/use-toast";

/**
 * Service for handling invoice email operations
 */
export const emailService = {
  /**
   * Send invoice via email
   */
  sendInvoiceEmail: async (orderId: string, email: string): Promise<boolean> => {
    try {
      // Generate the PDF and XML
      const pdfBlob = await pdfService.generatePDF(orderId);
      const xmlBlob = await xmlService.generateXML(orderId);
      const invoiceData = await prepareInvoiceData(orderId);
      
      // Convert blobs to base64
      const pdfBase64 = await blobToBase64(pdfBlob);
      const xmlBase64 = await blobToBase64(xmlBlob);
      
      if (!pdfBase64 || !xmlBase64) {
        throw new Error("Failed to convert files to base64");
      }
      
      // Find invoice ID if available
      const { data: invoice } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
      
      // Call Supabase Edge Function to send email with attachments
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
      
      // Update invoice status if available
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
      
      return true;
    } catch (error) {
      console.error("Error sending invoice email:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht per E-Mail versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  }
};

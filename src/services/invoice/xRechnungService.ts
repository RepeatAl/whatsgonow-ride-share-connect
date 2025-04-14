
import { supabase } from '@/lib/supabaseClient';
import { prepareInvoiceData } from '@/utils/invoice';
import { xmlService } from './xmlService';
import { blobToBase64 } from './helpers';
import { toast } from "@/hooks/use-toast";

/**
 * Service for handling XRechnung email operations
 */
export const xRechnungService = {
  /**
   * Check if recipient email is from a government agency
   */
  isGovernmentAgency: (email: string): boolean => {
    const governmentDomains = [
      "@bdr.de", 
      "@bund.de", 
      "@bundesregierung.de", 
      "@bundeswehr.org", 
      "@zoll.de",
      "@bzst.de",
      "@bafa.de"
    ];
    
    return governmentDomains.some(domain => 
      email.toLowerCase().endsWith(domain)
    );
  },

  /**
   * Send XRechnung via email to government agency
   */
  sendXRechnungEmail: async (orderId: string, email: string, recipientName: string): Promise<boolean> => {
    try {
      // Check if recipient is a government agency
      if (!xRechnungService.isGovernmentAgency(email)) {
        console.log("Recipient is not a government agency, skipping XRechnung email");
        return false;
      }

      // Find invoice ID if available
      const { data: invoice } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
      
      if (!invoice?.invoice_id) {
        throw new Error("No invoice found for this order");
      }

      // Generate the XML
      const xmlBlob = await xmlService.generateXML(orderId);
      
      // Convert blob to base64
      const xmlBase64 = await blobToBase64(xmlBlob);
      
      if (!xmlBase64) {
        throw new Error("Failed to convert XML to base64");
      }
      
      // Get order number or use order ID if not available
      const invoiceData = await prepareInvoiceData(orderId);
      const orderNumber = invoiceData.invoiceNumber || orderId;
      
      // Call Supabase Edge Function to send XRechnung email
      const { data, error } = await supabase.functions.invoke('send-xrechnung-email', {
        body: {
          invoiceId: invoice.invoice_id,
          recipientEmail: email,
          recipientName: recipientName || "Sehr geehrte Damen und Herren",
          orderNumber,
          xmlBase64
        }
      });
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "XRechnung versendet",
        description: "Die XRechnung wurde erfolgreich an die Behörde versendet."
      });
      
      return true;
    } catch (error) {
      console.error("Error sending XRechnung email:", error);
      toast({
        title: "Fehler",
        description: "Die XRechnung konnte nicht versendet werden.",
        variant: "destructive"
      });
      return false;
    }
  },

  /**
   * Automatically send XRechnung if recipient is a government agency
   */
  autoSendXRechnungIfGovernment: async (
    orderId: string, 
    email: string, 
    recipientName: string
  ): Promise<boolean> => {
    if (xRechnungService.isGovernmentAgency(email)) {
      return await xRechnungService.sendXRechnungEmail(orderId, email, recipientName);
    }
    return false;
  }
};

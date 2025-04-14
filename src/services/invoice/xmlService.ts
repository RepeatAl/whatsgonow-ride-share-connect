
import { generateXRechnungXML, prepareInvoiceData, stringToBlob } from '@/utils/invoice';
import { downloadBlob } from './helpers';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';

/**
 * Service for handling XML invoice operations
 */
export const xmlService = {
  /**
   * Generate XRechnung XML as blob
   */
  generateXML: async (orderId: string): Promise<Blob> => {
    try {
      // First get the invoice ID from the order ID
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
      
      if (invoiceError || !invoiceData) {
        console.error("Error fetching invoice for order:", invoiceError || "No invoice found");
        throw new Error("Keine Rechnung für diesen Auftrag gefunden");
      }
      
      const invoiceId = invoiceData.invoice_id;
      
      // Fetch all invoice related data
      const { data: invoice } = await supabase
        .from("invoices")
        .select("*")
        .eq("invoice_id", invoiceId)
        .single();
        
      const { data: items } = await supabase
        .from("invoice_line_items")
        .select("*")
        .eq("invoice_id", invoiceId);
        
      const { data: addresses } = await supabase
        .from("invoice_addresses")
        .select("*")
        .eq("invoice_id", invoiceId);
      
      // Process data for XML generation
      const completeInvoiceData = await prepareInvoiceData(orderId, {
        invoice,
        items: items || [],
        addresses: addresses || []
      });
      
      const xmlContent = generateXRechnungXML(completeInvoiceData);
      return stringToBlob(xmlContent, 'application/xml');
    } catch (error) {
      console.error("Error generating XML invoice:", error);
      throw new Error("Fehler bei der Erstellung der XML-Rechnung");
    }
  },

  /**
   * Download XML invoice (XRechnung)
   */
  downloadXMLInvoice: async (orderId: string, filename: string = "rechnung.xml") => {
    try {
      const xmlBlob = await xmlService.generateXML(orderId);
      downloadBlob(xmlBlob, filename);
      return true;
    } catch (error) {
      console.error("Error downloading XML invoice:", error);
      toast({
        title: "Fehler",
        description: "Die XML-Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
      return false;
    }
  }
};

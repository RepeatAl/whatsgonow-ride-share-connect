
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/InvoicePDF';
import { prepareInvoiceData } from '@/utils/invoice';
import { downloadBlob } from './helpers';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';

/**
 * Service for handling PDF invoice operations
 */
export const pdfService = {
  /**
   * Generate PDF invoice as blob
   */
  generatePDF: async (orderId: string): Promise<Blob> => {
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
      
      // Process data for PDF generation
      const completeInvoiceData = await prepareInvoiceData(orderId, {
        invoice,
        items: items || [],
        addresses: addresses || []
      });
      
      const pdfBlob = await pdf(InvoicePDF({ data: completeInvoiceData })).toBlob();
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF invoice:", error);
      throw new Error("Fehler bei der Erstellung der PDF-Rechnung");
    }
  },

  /**
   * Download PDF invoice
   */
  downloadPDFInvoice: async (orderId: string, filename: string = "rechnung.pdf") => {
    try {
      const pdfBlob = await pdfService.generatePDF(orderId);
      downloadBlob(pdfBlob, filename);
      return true;
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
      return false;
    }
  }
};

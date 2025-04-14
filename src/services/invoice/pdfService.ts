
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/pdf/InvoicePDF';
import { prepareInvoiceData } from '@/utils/invoice';
import { downloadBlob } from './helpers';
import { toast } from "@/hooks/use-toast";

/**
 * Service for handling PDF invoice operations
 */
export const pdfService = {
  /**
   * Generate PDF invoice as blob
   */
  generatePDF: async (orderId: string): Promise<Blob> => {
    try {
      const invoiceData = await prepareInvoiceData(orderId);
      const pdfBlob = await pdf(InvoicePDF({ data: invoiceData })).toBlob();
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

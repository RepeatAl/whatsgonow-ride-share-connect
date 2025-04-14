
import { generateXRechnungXML, prepareInvoiceData, stringToBlob } from '@/utils/invoice';
import { downloadBlob } from './helpers';
import { toast } from "@/hooks/use-toast";

/**
 * Service for handling XML invoice operations
 */
export const xmlService = {
  /**
   * Generate XRechnung XML as blob
   */
  generateXML: async (orderId: string): Promise<Blob> => {
    try {
      const invoiceData = await prepareInvoiceData(orderId);
      const xmlContent = generateXRechnungXML(invoiceData);
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

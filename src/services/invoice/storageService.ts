
import { supabase } from '@/lib/supabaseClient';
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';

/**
 * Service for handling invoice storage operations
 */
export const storageService = {
  /**
   * Upload invoice to Supabase Storage
   */
  storeInvoice: async (orderId: string): Promise<{ pdfPath: string; xmlPath: string } | null> => {
    try {
      const pdfBlob = await pdfService.generatePDF(orderId);
      const xmlBlob = await xmlService.generateXML(orderId);
      
      const pdfFilename = `invoice-${orderId}.pdf`;
      const xmlFilename = `invoice-${orderId}.xml`;
      
      // Upload PDF to 'invoices' bucket
      const { data: pdfData, error: pdfError } = await supabase.storage
        .from('invoices')
        .upload(pdfFilename, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (pdfError) throw pdfError;
      
      // Upload XML to 'invoices' bucket
      const { data: xmlData, error: xmlError } = await supabase.storage
        .from('invoices')
        .upload(xmlFilename, xmlBlob, {
          contentType: 'application/xml',
          upsert: true
        });
      
      if (xmlError) throw xmlError;
      
      return {
        pdfPath: pdfData.path,
        xmlPath: xmlData.path
      };
    } catch (error) {
      console.error("Error storing invoice:", error);
      return null;
    }
  }
};

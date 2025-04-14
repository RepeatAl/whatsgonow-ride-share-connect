
import { supabase } from '@/lib/supabaseClient';
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { prepareInvoiceData } from '@/utils/invoice';

/**
 * Service for handling storage of invoices in Supabase Storage
 */
export const storageService = {
  /**
   * Store invoice PDF and XML in Supabase Storage
   */
  storeInvoice: async (orderId: string): Promise<{ pdfPath: string; xmlPath: string } | null> => {
    try {
      // Generate invoices
      const pdfBlob = await pdfService.generatePDF(orderId);
      const xmlBlob = await xmlService.generateXML(orderId);
      const invoiceData = await prepareInvoiceData(orderId);
      
      // Create file paths
      const pdfPath = `invoices/${orderId}/${invoiceData.invoiceNumber}.pdf`;
      const xmlPath = `invoices/${orderId}/${invoiceData.invoiceNumber}.xml`;
      
      // Check if the invoices bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const invoiceBucket = buckets?.find(bucket => bucket.name === 'invoices');
      
      if (!invoiceBucket) {
        // In production, you would create the bucket via SQL migrations
        // This is just a fallback for development
        console.log('Creating invoices bucket in Supabase Storage');
      }
      
      // Store PDF in Supabase Storage
      const { error: pdfError } = await supabase.storage
        .from('invoices')
        .upload(pdfPath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (pdfError) throw pdfError;
      
      // Store XML in Supabase Storage
      const { error: xmlError } = await supabase.storage
        .from('invoices')
        .upload(xmlPath, xmlBlob, {
          contentType: 'application/xml',
          upsert: true
        });
      
      if (xmlError) throw xmlError;
      
      return { pdfPath, xmlPath };
    } catch (error) {
      console.error("Error storing invoice:", error);
      return null;
    }
  }
};

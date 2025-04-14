
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";
import { prepareInvoiceData } from '@/utils/invoice';
import { validateInvoice } from '@/utils/invoice/validation';

/**
 * Core storage functionality for invoices
 */
export const storageCore = {
  /**
   * Store invoice PDFs and XMLs in Supabase Storage
   */
  storeFiles: async (
    invoiceId: string, 
    pdfBlob: Blob, 
    xmlBlob: Blob, 
    invoiceData: any
  ): Promise<{ pdfPath: string; xmlPath: string; pdfUrl?: string; xmlUrl?: string } | null> => {
    try {
      // Create folder structure following our RLS pattern: invoices/[invoice_id]/...
      const pdfPath = `invoices/${invoiceId}/${invoiceData.invoiceNumber}.pdf`;
      const xmlPath = `invoices/${invoiceId}/${invoiceData.invoiceNumber}.xml`;
      
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
      
      // Get signed URLs for the files (since the bucket is private)
      const { data: pdfUrl } = await supabase.storage
        .from('invoices')
        .createSignedUrl(pdfPath, 60 * 60 * 24 * 7); // 7 days
        
      const { data: xmlUrl } = await supabase.storage
        .from('invoices')
        .createSignedUrl(xmlPath, 60 * 60 * 24 * 7); // 7 days
      
      return { 
        pdfPath, 
        xmlPath, 
        pdfUrl: pdfUrl?.signedUrl,
        xmlUrl: xmlUrl?.signedUrl
      };
    } catch (error) {
      console.error("Error storing invoice files:", error);
      return null;
    }
  },
  
  /**
   * Create or update invoice record in database
   */
  updateInvoiceRecord: async (
    invoiceId: string, 
    pdfUrl: string | undefined, 
    xmlUrl: string | undefined
  ): Promise<boolean> => {
    try {
      await supabase
        .from('invoices')
        .update({ 
          pdf_url: pdfUrl || null,
          xml_url: xmlUrl || null,
          status: 'stored',
          updated_at: new Date().toISOString()
        })
        .eq('invoice_id', invoiceId);
      
      return true;
    } catch (error) {
      console.error("Error updating invoice record:", error);
      return false;
    }
  }
};

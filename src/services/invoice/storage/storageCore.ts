
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";
import { prepareInvoiceData } from '@/utils/invoice';
import { validateInvoice } from '@/utils/invoice/validation';
import { storageUtils } from './storageUtils';

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
      
      // Store PDF in Supabase Storage using the utility
      const pdfResult = await storageUtils.uploadFile(
        'invoices',
        pdfPath,
        pdfBlob,
        'application/pdf'
      );
      
      if (!pdfResult) {
        throw new Error('Failed to upload PDF file');
      }
      
      // Store XML in Supabase Storage using the utility
      const xmlResult = await storageUtils.uploadFile(
        'invoices',
        xmlPath,
        xmlBlob,
        'application/xml'
      );
      
      if (!xmlResult) {
        throw new Error('Failed to upload XML file');
      }
      
      return { 
        pdfPath, 
        xmlPath, 
        pdfUrl: pdfResult.url,
        xmlUrl: xmlResult.url
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


import { pdfService } from '../pdfService';
import { xmlService } from '../xmlService';
import { prepareInvoiceData } from '@/utils/invoice';
import { validateInvoice } from '@/utils/invoice/validation';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { storageCore } from './storageCore';
import { invoiceQueries } from './invoiceQueries';
import { storageUtils } from './storageUtils';

/**
 * Service for handling storage of invoices in Supabase Storage
 */
export const storageService = {
  /**
   * Store invoice PDF and XML in Supabase Storage and record in database
   */
  storeInvoice: async (orderId: string): Promise<{ pdfPath: string; xmlPath: string } | null> => {
    try {
      // Generate invoices
      const pdfBlob = await pdfService.generatePDF(orderId);
      const xmlBlob = await xmlService.generateXML(orderId);
      const invoiceData = await prepareInvoiceData(orderId);
      
      // Check if invoice exists
      const { data: invoiceRecord, error: invoiceError } = 
        await invoiceQueries.getInvoiceIdFromOrder(orderId);
      
      // If no invoice exists yet, create one to get the invoice_id
      let invoiceId = invoiceRecord?.invoice_id;
      if (!invoiceId) {
        // Get order data to link to sender
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('sender_id')
          .eq('order_id', orderId)
          .single();
          
        if (orderError) {
          console.error("Error fetching order data:", orderError);
          throw new Error("Order not found");
        }
        
        // Create invoice record
        const { data: newInvoice, error: createError } = 
          await invoiceQueries.createInvoiceRecord(orderData, invoiceData);
          
        if (createError) {
          console.error("Error creating invoice record:", createError);
          throw new Error("Failed to create invoice");
        }
        
        invoiceId = newInvoice.invoice_id;
      }
      
      // Store the files
      const storedFiles = await storageCore.storeFiles(
        invoiceId, 
        pdfBlob, 
        xmlBlob, 
        invoiceData
      );
      
      if (!storedFiles) {
        throw new Error("Failed to store invoice files");
      }
      
      // Update invoice record with file URLs
      await storageCore.updateInvoiceRecord(
        invoiceId, 
        storedFiles.pdfUrl, 
        storedFiles.xmlUrl
      );
      
      console.log("Invoice stored successfully in bucket:", storedFiles);
      
      // Run validation on the stored invoice
      await validateInvoice(invoiceId);
      
      return { 
        pdfPath: storedFiles.pdfPath, 
        xmlPath: storedFiles.xmlPath 
      };
    } catch (error) {
      console.error("Error storing invoice:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht gespeichert werden.",
        variant: "destructive"
      });
      return null;
    }
  },
  
  // Expose the uploadFile utility
  uploadFile: storageUtils.uploadFile,
  
  // Re-export query functions for external use with appropriate return types
  getInvoicesForUser: invoiceQueries.getInvoicesForUser,
  
  // This function returns the invoice directly, not a {data, error} object
  getInvoiceById: async (invoiceId: string) => {
    return invoiceQueries.getInvoiceById(invoiceId);
  }
};

// Export utilities
export { storageUtils };

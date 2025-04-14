
import { supabase } from '@/lib/supabaseClient';
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { prepareInvoiceData } from '@/utils/invoice';
import { toast } from "@/hooks/use-toast";
import { validateInvoice } from '@/utils/invoice/validation';

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
      
      // Create file paths based on invoice ID to match our RLS policy pattern
      const { data: invoiceRecord } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
      
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
        
        // Create invoice record to get an ID
        const { data: newInvoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            order_id: orderId,
            sender_id: orderData.sender_id,
            amount: invoiceData.total,
            currency: 'EUR',
            status: 'draft'
          })
          .select()
          .single();
          
        if (invoiceError) {
          console.error("Error creating invoice record:", invoiceError);
          throw new Error("Failed to create invoice");
        }
        
        invoiceId = newInvoice.invoice_id;
      }
      
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
      
      // Update invoice record with file URLs
      await supabase
        .from('invoices')
        .update({ 
          pdf_url: pdfUrl?.signedUrl || null,
          xml_url: xmlUrl?.signedUrl || null,
          status: 'stored',
          updated_at: new Date().toISOString()
        })
        .eq('invoice_id', invoiceId);
      
      console.log("Invoice stored successfully in bucket:", { pdfPath, xmlPath });
      
      // Run validation on the stored invoice
      await validateInvoice(invoiceId);
      
      return { pdfPath, xmlPath };
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
  
  /**
   * Get invoice records for a user
   */
  getInvoicesForUser: async (userId: string, role: 'sender' | 'recipient' = 'sender') => {
    try {
      const column = role === 'sender' ? 'sender_id' : 'recipient_id';
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          invoice_id,
          order_id,
          amount,
          currency,
          status,
          pdf_url,
          xml_url,
          sent_at,
          created_at,
          orders(
            from_address,
            to_address,
            description
          )
        `)
        .eq(column, userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
  },
  
  /**
   * Get a single invoice by ID
   */
  getInvoiceById: async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          invoice_id,
          order_id,
          sender_id,
          recipient_id,
          amount,
          currency,
          status,
          pdf_url,
          xml_url,
          sent_at,
          created_at,
          updated_at,
          orders(
            from_address,
            to_address,
            description
          )
        `)
        .eq('invoice_id', invoiceId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return null;
    }
  }
};

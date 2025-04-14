
import { supabase } from '@/lib/supabaseClient';
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { prepareInvoiceData } from '@/utils/invoice';
import { toast } from "@/hooks/use-toast";

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
        await supabase.storage.createBucket('invoices', {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
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
      
      // Get public URLs (or signed URLs in production)
      const { data: pdfUrl } = supabase.storage
        .from('invoices')
        .getPublicUrl(pdfPath);
        
      const { data: xmlUrl } = supabase.storage
        .from('invoices')
        .getPublicUrl(xmlPath);
      
      // Get order and recipient information
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('sender_id')
        .eq('order_id', orderId)
        .single();
        
      if (orderError) {
        console.error("Error fetching order data:", orderError);
      }
      
      // Store invoice record in database
      if (orderData?.sender_id) {
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .upsert({
            order_id: orderId,
            sender_id: orderData.sender_id,
            recipient_id: invoiceData.recipient.email ? null : null, // Would be set in a real app
            amount: invoiceData.total,
            currency: 'EUR',
            status: 'sent',
            pdf_url: pdfUrl?.publicUrl || null,
            xml_url: xmlUrl?.publicUrl || null,
            sent_at: new Date().toISOString(),
          }, {
            onConflict: 'order_id'
          })
          .select()
          .single();
          
        if (invoiceError) {
          console.error("Error storing invoice record:", invoiceError);
          toast({
            title: "Hinweis",
            description: "Rechnung wurde erstellt, aber nicht in der Datenbank gespeichert.",
            variant: "default"
          });
        } else {
          console.log("Invoice stored successfully:", invoice);
        }
      }
      
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

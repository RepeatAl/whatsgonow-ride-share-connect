
import { supabase } from '@/lib/supabaseClient';

/**
 * Database query operations for invoices
 */
export const invoiceQueries = {
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
   * Returns the invoice object directly, not a {data, error} object
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
          digital_signature,
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
  },
  
  /**
   * Get invoice ID from order ID
   */
  getInvoiceIdFromOrder: async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_id')
        .eq('order_id', orderId)
        .maybeSingle();
        
      return { data, error };
    } catch (error) {
      console.error("Error fetching invoice ID:", error);
      return { data: null, error };
    }
  },
  
  /**
   * Create new invoice record
   */
  createInvoiceRecord: async (orderData: any, invoiceData: any) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          order_id: invoiceData.orderId,
          sender_id: orderData.sender_id,
          amount: invoiceData.total,
          currency: 'EUR',
          status: 'draft'
        })
        .select()
        .single();
        
      return { data, error };
    } catch (error) {
      console.error("Error creating invoice record:", error);
      return { data: null, error };
    }
  }
};


import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";

/**
 * Service for detailed invoice operations that leverage the extended database schema
 */
export const detailedInvoiceService = {
  /**
   * Create a detailed invoice with addresses and line items
   */
  createDetailedInvoice: async (invoiceData: any) => {
    try {
      // First, create the invoice record
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert(invoiceData)
        .select("*")
        .single();
        
      if (invoiceError) {
        console.error("Invoice creation failed:", invoiceError);
        throw new Error("Invoice creation failed");
      }

      // Add sender address information if provided
      if (invoiceData.senderAddress) {
        const { error: senderAddressError } = await supabase
          .from("invoice_addresses")
          .insert({
            invoice_id: invoice.invoice_id,
            entity_type: "sender",
            ...invoiceData.senderAddress
          });
          
        if (senderAddressError) {
          console.error("Sender address creation failed:", senderAddressError);
        }
      }
      
      // Add recipient address information if provided
      if (invoiceData.recipientAddress) {
        const { error: recipientAddressError } = await supabase
          .from("invoice_addresses")
          .insert({
            invoice_id: invoice.invoice_id,
            entity_type: "recipient",
            ...invoiceData.recipientAddress
          });
          
        if (recipientAddressError) {
          console.error("Recipient address creation failed:", recipientAddressError);
        }
      }
      
      // Add line items if provided
      if (invoiceData.lineItems && Array.isArray(invoiceData.lineItems) && invoiceData.lineItems.length > 0) {
        const lineItemsWithInvoiceId = invoiceData.lineItems.map((item: any) => ({
          invoice_id: invoice.invoice_id,
          ...item
        }));
        
        const { error: lineItemsError } = await supabase
          .from("invoice_line_items")
          .insert(lineItemsWithInvoiceId);
          
        if (lineItemsError) {
          console.error("Line items creation failed:", lineItemsError);
        }
      }
      
      // Log the invoice creation
      await supabase
        .from('invoice_audit_log')
        .insert({
          invoice_id: invoice.invoice_id,
          action: 'created',
          user_id: invoiceData.sender_id,
          new_state: invoice
        });
      
      console.log(`Detailed invoice created with ID: ${invoice.invoice_id}`);
      return invoice;
    } catch (error) {
      console.error("Error in detailed invoice creation:", error);
      toast({
        title: "Fehler",
        description: "Die Rechnung konnte nicht erstellt werden.",
        variant: "destructive"
      });
      throw error;
    }
  },
  
  /**
   * Get a detailed invoice with all related data
   */
  getDetailedInvoice: async (invoiceId: string) => {
    try {
      // Get the main invoice data
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select("*")
        .eq("invoice_id", invoiceId)
        .single();
        
      if (invoiceError) {
        console.error("Invoice retrieval failed:", invoiceError);
        return null;
      }
      
      // Get the address information
      const { data: addresses, error: addressesError } = await supabase
        .from("invoice_addresses")
        .select("*")
        .eq("invoice_id", invoiceId);
        
      if (addressesError) {
        console.error("Address retrieval failed:", addressesError);
      }
      
      // Get the line items
      const { data: lineItems, error: lineItemsError } = await supabase
        .from("invoice_line_items")
        .select("*")
        .eq("invoice_id", invoiceId);
        
      if (lineItemsError) {
        console.error("Line items retrieval failed:", lineItemsError);
      }
      
      // Organize addresses by entity type
      const senderAddress = addresses?.find(addr => addr.entity_type === 'sender');
      const recipientAddress = addresses?.find(addr => addr.entity_type === 'recipient');
      
      return {
        ...invoice,
        senderAddress,
        recipientAddress,
        lineItems: lineItems || []
      };
    } catch (error) {
      console.error("Error getting detailed invoice:", error);
      return null;
    }
  }
};

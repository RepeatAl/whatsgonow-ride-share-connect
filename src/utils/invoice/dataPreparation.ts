
import { supabase } from '@/lib/supabaseClient';
import { InvoiceData, InvoiceItem, InvoiceAddress } from './invoiceTypes';
import { generateInvoiceNumber, calculateDueDate, getServiceDescription } from './invoiceUtils';

/**
 * Prepare invoice data for PDF/XML generation
 */
export const prepareInvoiceData = async (
  orderId: string, 
  existingData?: { 
    invoice?: any, 
    items?: any[], 
    addresses?: any[] 
  }
): Promise<InvoiceData> => {
  try {
    let invoice, items, addresses;
    
    // Use existing data if provided, otherwise fetch from database
    if (existingData) {
      invoice = existingData.invoice;
      items = existingData.items;
      addresses = existingData.addresses;
    }
    
    // If we don't have the data yet, fetch it
    if (!invoice) {
      // Get invoice data for the order
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();
        
      if (invoiceError || !invoiceData) {
        console.error("Error fetching invoice:", invoiceError || "No invoice found");
        throw new Error("Keine Rechnung für diesen Auftrag gefunden");
      }
      
      invoice = invoiceData;
      
      // Fetch additional data if not provided
      if (!items) {
        const { data: lineItems } = await supabase
          .from("invoice_line_items")
          .select("*")
          .eq("invoice_id", invoice.invoice_id);
          
        items = lineItems || [];
      }
      
      if (!addresses) {
        const { data: addressData } = await supabase
          .from("invoice_addresses")
          .select("*")
          .eq("invoice_id", invoice.invoice_id);
          
        addresses = addressData || [];
      }
    }
    
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();
      
    if (orderError) {
      console.error("Error fetching order:", orderError);
      throw new Error("Auftrag nicht gefunden");
    }
    
    // Find sender and recipient addresses
    const senderAddress = addresses?.find((addr: any) => addr.entity_type === 'sender') || {};
    const recipientAddress = addresses?.find((addr: any) => addr.entity_type === 'recipient') || {};
    
    // Format invoice items
    const formattedItems: InvoiceItem[] = items?.map((item: any, index: number) => ({
      id: item.item_id || `item-${index}`,
      description: item.description || getServiceDescription(order),
      quantity: item.quantity || 1,
      unitPrice: item.unit_price || invoice.amount || 0,
      totalPrice: item.total_price || invoice.amount || 0,
      taxRate: item.tax_rate || 19
    })) || [{
      id: 'default-item',
      description: getServiceDescription(order),
      quantity: 1,
      unitPrice: invoice.amount || 0,
      totalPrice: invoice.amount || 0,
      taxRate: 19
    }];
    
    // Calculate totals
    const subtotal = formattedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = formattedItems.reduce((sum, item) => sum + (item.totalPrice * (item.taxRate || 19) / 100), 0);
    const total = subtotal + taxAmount;
    
    // Format sender and recipient addresses
    const formatAddress = (address: any): InvoiceAddress => {
      return {
        name: address.company_name || '',
        street: address.street || '',
        city: address.city || '',
        postalCode: address.postal_code || '',
        country: address.country || 'DE',
        vatId: address.vat_id || '',
        email: address.email || '',
        phone: address.phone || ''
      };
    };
    
    // Default values if not found in database
    const today = new Date();
    const invoiceNumber = invoice.invoice_number || generateInvoiceNumber(orderId);
    const dueDate = invoice.due_date || calculateDueDate(today, 14);
    
    // Compile the final invoice data
    return {
      invoiceNumber,
      date: invoice.created_at || today.toISOString(),
      dueDate: dueDate,
      orderId,
      serviceDate: order.verified_at || today.toISOString(),
      paymentMethod: 'Überweisung',
      sender: formatAddress(senderAddress),
      recipient: formatAddress(recipientAddress),
      items: formattedItems,
      subtotal,
      taxAmount,
      total,
      notes: 'Vielen Dank für Ihr Vertrauen. Bitte überweisen Sie den Betrag innerhalb der Zahlungsfrist.'
    };
  } catch (error) {
    console.error("Error preparing invoice data:", error);
    throw error;
  }
};

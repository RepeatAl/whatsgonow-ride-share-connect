
/**
 * Functions for preparing invoice data
 */
import { InvoiceData, InvoiceItem } from './invoiceTypes';
import { supabase } from '@/integrations/supabase/client';
import { generateInvoiceNumber, calculateDueDate, getServiceDescription } from './invoiceUtils';

export const prepareInvoiceData = async (orderId: string): Promise<InvoiceData> => {
  try {
    // In a real app, we would fetch from Supabase
    // For now, we'll mock the data
    const { mockRequests } = await import('@/data/mockData');
    const order = mockRequests.find(req => req.id === orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    // Prepare seller address (Whatsgonow)
    const seller = {
      name: "Whatsgonow GmbH",
      street: "Musterstraße 123",
      city: "Berlin",
      postalCode: "10115",
      country: "DE",
      email: "buchhaltung@whatsgonow.de",
      phone: "+49 30 12345678",
      vatId: "DE123456789",
    };
    
    // Prepare buyer address
    const buyer = {
      name: order.requester.name,
      street: order.pickupLocation.split(',')[0],
      city: order.pickupLocation.split(',')[1]?.trim() || "Berlin",
      postalCode: "10115", // Mocked
      country: "DE",
      email: "customer@example.com", // Mocked
    };
    
    // Create invoice items
    const serviceItem: InvoiceItem = {
      id: "1",
      description: getServiceDescription(order.pickupLocation, order.deliveryLocation),
      quantity: 1,
      unitPrice: order.budget,
      totalPrice: order.budget,
      taxRate: 19, // Default German VAT rate
    };
    
    // Calculate totals
    const subtotal = serviceItem.totalPrice;
    const taxAmount = subtotal * (serviceItem.taxRate! / 100);
    const total = subtotal + taxAmount;
    
    // Generate invoice data
    const invoiceDate = new Date();
    const invoiceData: InvoiceData = {
      invoiceNumber: generateInvoiceNumber(orderId),
      date: invoiceDate.toISOString().split('T')[0],
      dueDate: calculateDueDate(invoiceDate),
      orderId,
      serviceDate: order.deadline.split('T')[0],
      paymentMethod: "Überweisung",
      sender: seller,
      recipient: buyer,
      items: [serviceItem],
      subtotal,
      taxAmount,
      total,
      notes: "Vielen Dank für Ihren Auftrag. Bitte begleichen Sie den Rechnungsbetrag innerhalb der angegebenen Zahlungsfrist.",
    };
    
    return invoiceData;
  } catch (error) {
    console.error("Error preparing invoice data:", error);
    throw error;
  }
};

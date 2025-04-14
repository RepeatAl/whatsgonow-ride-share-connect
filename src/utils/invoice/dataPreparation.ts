
/**
 * Functions for preparing invoice data from order data
 */

import { InvoiceData } from './invoiceTypes';
import { generateInvoiceNumber, calculateDueDate } from './invoiceUtils';

export const prepareInvoiceData = async (orderId: string): Promise<InvoiceData> => {
  try {
    // In a real app, we would fetch from Supabase
    // For now, we'll mock the data based on our mockData structure
    const { mockRequests } = await import('@/data/mockData');
    const order = mockRequests.find(req => req.id === orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    const invoiceDate = new Date();
    const taxRate = 19; // 19% MwSt
    const serviceAmount = order.budget;
    const taxAmount = (serviceAmount * taxRate) / 100;
    const totalAmount = serviceAmount + taxAmount;
    
    return {
      invoiceNumber: generateInvoiceNumber(orderId),
      date: invoiceDate.toISOString().split('T')[0], // YYYY-MM-DD
      dueDate: calculateDueDate(invoiceDate),
      customerName: "Max Mustermann", // In real app: fetch from users table
      customerAddress: "Musterstraße 123, 12345 Berlin", // In real app: fetch address
      items: [
        {
          description: `Transportdienstleistung von ${order.pickupLocation} nach ${order.deliveryLocation}`,
          quantity: 1,
          unitPrice: serviceAmount,
          amount: serviceAmount,
          taxRate: taxRate,
          totalPrice: serviceAmount
        }
      ],
      subtotal: serviceAmount,
      taxRate: taxRate,
      taxAmount: taxAmount,
      total: totalAmount,
      notes: "Vielen Dank für Ihren Auftrag. Bitte überweisen Sie den Rechnungsbetrag innerhalb der Zahlungsfrist.",
      paymentInfo: "IBAN: DE12 3456 7890 1234 5678 90\nBIC: DEUTDEDBXXX\nBank: Deutsche Bank",
      orderId: orderId,
      serviceDate: invoiceDate.toISOString().split('T')[0],
      paymentMethod: "Überweisung",
      sender: {
        name: "Whatsgonow GmbH",
        address: "Startup Allee 42, 10115 Berlin",
        taxId: "DE123456789",
        email: "kontakt@whatsgonow.de",
        website: "www.whatsgonow.de"
      },
      recipient: {
        name: "Max Mustermann",
        address: "Musterstraße 123, 12345 Berlin",
        email: "max.mustermann@example.com"
      },
      sellerInfo: {
        name: "Whatsgonow GmbH",
        address: "Startup Allee 42, 10115 Berlin",
        taxId: "USt-ID: DE123456789",
        email: "kontakt@whatsgonow.de",
        website: "www.whatsgonow.de"
      }
    };
  } catch (error) {
    console.error("Error preparing invoice data:", error);
    throw error;
  }
};

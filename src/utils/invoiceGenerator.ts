
import { TransportRequest } from "@/data/mockData";

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  paymentInfo: string;
  sellerInfo: {
    name: string;
    address: string;
    taxId: string;
    email: string;
    website: string;
  };
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export const generateInvoiceNumber = (orderId: string): string => {
  // Format: RE-YEAR-ORDERID (shortened)
  const year = new Date().getFullYear();
  const shortOrderId = orderId.substring(0, 8);
  return `RE-${year}-${shortOrderId}`;
};

export const calculateDueDate = (invoiceDate: Date, daysUntilDue: number = 14): string => {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + daysUntilDue);
  return dueDate.toISOString().split('T')[0];
};

const formatCurrency = (amount: number): string => {
  return amount.toFixed(2) + ' €';
};

export const getServiceDescription = (origin: string, destination: string): string => {
  return `Transportdienstleistung von ${origin} nach ${destination}`;
};

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
          description: getServiceDescription(order.pickupLocation, order.deliveryLocation),
          quantity: 1,
          unitPrice: serviceAmount,
          amount: serviceAmount
        }
      ],
      subtotal: serviceAmount,
      taxRate: taxRate,
      taxAmount: taxAmount,
      total: totalAmount,
      notes: "Vielen Dank für Ihren Auftrag. Bitte überweisen Sie den Rechnungsbetrag innerhalb der Zahlungsfrist.",
      paymentInfo: "IBAN: DE12 3456 7890 1234 5678 90\nBIC: DEUTDEDBXXX\nBank: Deutsche Bank",
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

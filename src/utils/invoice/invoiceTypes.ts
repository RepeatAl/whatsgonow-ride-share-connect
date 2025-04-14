
/**
 * Type definitions for invoice generation
 */

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
  orderId: string;
  serviceDate: string;
  paymentMethod: string;
  sender: {
    name: string;
    address: string;
    taxId: string;
    email: string;
    website: string;
  };
  recipient: {
    name: string;
    address: string;
    email: string;
  };
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
  taxRate: number;
  totalPrice: number;
}

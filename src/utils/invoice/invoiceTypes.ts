
/**
 * Type definitions for invoice data
 */

export interface InvoiceAddress {
  name: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phone?: string;
  vatId?: string;
  address?: string; // Added to support the AddressSection component
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  orderId: string;
  serviceDate?: string;
  paymentMethod?: string;
  sender: InvoiceAddress;
  recipient: InvoiceAddress;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes?: string;
}

// Added for tax ID validation
export type TaxIdType = 'ustid' | 'steuernummer';

export interface TaxIdentification {
  type: TaxIdType;
  value: string;
  isValid: boolean;
}

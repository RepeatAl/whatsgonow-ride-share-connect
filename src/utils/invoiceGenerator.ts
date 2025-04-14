
import { format } from 'date-fns';
import { TransportRequest } from "@/data/mockData";
import { formatDate } from './pdfGenerator';

// Invoice details interface
export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  orderId: string;
  sender: {
    name: string;
    address: string;
    taxId: string;
    email: string;
  };
  recipient: {
    name: string;
    address: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxAmount: number;
  total: number;
  serviceDate: string;
  paymentMethod: string;
  notes: string;
}

// Generate a unique invoice number
export const generateInvoiceNumber = (orderId: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `WGN-${year}${month}-${randomPart}-${orderId.substring(0, 4)}`;
};

// Prepare invoice data from order
export const prepareInvoiceData = async (orderId: string): Promise<InvoiceData> => {
  try {
    // In a real app, fetch from Supabase
    const { mockRequests } = await import('@/data/mockData');
    const order = mockRequests.find(req => req.id === orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    const date = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days payment term
    
    // Tax calculation (19% standard German VAT)
    const taxRate = 0.19;
    const subtotal = Number(order.budget);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    
    // Format dates for invoice
    const formattedDate = formatDate(date);
    const formattedDueDate = formatDate(dueDate);
    const serviceDate = formatDate(order.deadline);
    
    return {
      invoiceNumber: generateInvoiceNumber(orderId),
      date: formattedDate,
      dueDate: formattedDueDate,
      orderId: order.id,
      sender: {
        name: "Whatsgonow GmbH",
        address: "Musterstraße 123, 10115 Berlin, Deutschland",
        taxId: "DE123456789",
        email: "buchhaltung@whatsgonow.de"
      },
      recipient: {
        name: order.requester.name || "Max Mustermann", // In real app: fetch from users table
        address: order.pickupLocation,
        email: "user@example.com" // In real app: fetch from users table
      },
      items: [
        {
          description: `Transport von ${order.pickupLocation} nach ${order.deliveryLocation}`,
          quantity: 1,
          unitPrice: subtotal,
          taxRate: taxRate * 100,
          totalPrice: subtotal
        }
      ],
      subtotal,
      taxAmount,
      total,
      serviceDate,
      paymentMethod: "Überweisung",
      notes: "Dieses Dokument wurde maschinell erstellt und entspricht den Anforderungen an elektronische Rechnungen nach §14 UStG (Stand 2025)."
    };
  } catch (error) {
    console.error("Error preparing invoice data:", error);
    throw error;
  }
};

// Generate XML for XRechnung
export const generateXRechnungXML = (invoiceData: InvoiceData): string => {
  // This is a simplified version - a real implementation would need to follow the exact XRechnung schema
  const dateForXml = invoiceData.date.split('.').reverse().join('-');
  const dueDateForXml = invoiceData.dueDate.split('.').reverse().join('-');
  const serviceDateForXml = invoiceData.serviceDate.split('.').reverse().join('-');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_2.0</cbc:CustomizationID>
  <cbc:ID>${invoiceData.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>${dateForXml}</cbc:IssueDate>
  <cbc:DueDate>${dueDateForXml}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:Note>${invoiceData.notes}</cbc:Note>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
  <cbc:TaxCurrencyCode>EUR</cbc:TaxCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${invoiceData.sender.name}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${invoiceData.sender.address.split(',')[0]}</cbc:StreetName>
        <cbc:CityName>Berlin</cbc:CityName>
        <cbc:PostalZone>10115</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${invoiceData.sender.taxId}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:Contact>
        <cbc:ElectronicMail>${invoiceData.sender.email}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${invoiceData.recipient.name}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${invoiceData.recipient.address.split(',')[0] || "Unknown"}</cbc:StreetName>
        <cbc:CityName>${invoiceData.recipient.address.split(',')[1]?.trim() || "Unknown"}</cbc:CityName>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:Contact>
        <cbc:ElectronicMail>${invoiceData.recipient.email}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="EUR">${invoiceData.taxAmount.toFixed(2)}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="EUR">${invoiceData.subtotal.toFixed(2)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="EUR">${invoiceData.taxAmount.toFixed(2)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>${invoiceData.items[0].taxRate}</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">${invoiceData.subtotal.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">${invoiceData.subtotal.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">${invoiceData.total.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">${invoiceData.total.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="C62">${invoiceData.items[0].quantity}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="EUR">${invoiceData.items[0].totalPrice.toFixed(2)}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Name>${invoiceData.items[0].description}</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>${invoiceData.items[0].taxRate}</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="EUR">${invoiceData.items[0].unitPrice.toFixed(2)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
</ubl:Invoice>`;
};

// Helper function to convert string to Blob
export const stringToBlob = (content: string, mimeType: string): Blob => {
  return new Blob([content], { type: mimeType });
};

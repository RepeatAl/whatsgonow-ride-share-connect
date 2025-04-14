
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
  // Add missing fields that InvoicePDF component uses
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
  // Add missing fields that InvoicePDF component uses
  taxRate: number;
  totalPrice: number;
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

// Add generateXRechnungXML and stringToBlob functions
export const generateXRechnungXML = (invoiceData: InvoiceData): string => {
  // This is a simplified XRechnung XML generator
  // In a real implementation, this would need to follow the XRechnung standard exactly
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_2.0</cbc:CustomizationID>
  <cbc:ID>${invoiceData.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>${invoiceData.date}</cbc:IssueDate>
  <cbc:DueDate>${invoiceData.dueDate}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
  <cbc:BuyerReference>${invoiceData.orderId}</cbc:BuyerReference>
  
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${invoiceData.sender.name}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${invoiceData.sender.address}</cbc:StreetName>
        <cbc:CityName>Berlin</cbc:CityName>
        <cbc:PostalZone>10115</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${invoiceData.sender.taxId}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VA</cbc:ID>
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
        <cbc:StreetName>${invoiceData.recipient.address}</cbc:StreetName>
        <cbc:CityName>Berlin</cbc:CityName>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:Contact>
        <cbc:ElectronicMail>${invoiceData.recipient.email}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>
  
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">${invoiceData.subtotal.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">${invoiceData.subtotal.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">${invoiceData.total.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">${invoiceData.total.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  
  ${invoiceData.items.map((item, index) => `
  <cac:InvoiceLine>
    <cbc:ID>${index + 1}</cbc:ID>
    <cbc:InvoicedQuantity>${item.quantity}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="EUR">${item.amount.toFixed(2)}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>${item.description}</cbc:Description>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="EUR">${item.unitPrice.toFixed(2)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
  `).join('')}
</ubl:Invoice>`;

  return xml;
};

export const stringToBlob = (content: string, mimeType: string): Blob => {
  return new Blob([content], { type: mimeType });
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
          amount: serviceAmount,
          // Add missing fields
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
      // Add required fields for InvoicePDF
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


/**
 * Functions for generating XRechnung XML
 */
import { InvoiceData } from './invoiceTypes';

export const stringToBlob = (content: string, contentType: string): Blob => {
  return new Blob([content], { type: contentType });
};

export const generateXRechnungXML = (data: InvoiceData): string => {
  // In a real application, this would generate proper XRechnung XML
  // This is a simplified example
  return `<?xml version="1.0" encoding="UTF-8"?>
<invoice:invoice xmlns:invoice="urn:xrechnung:1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <invoice:header>
    <invoice:invoiceNumber>${data.invoiceNumber}</invoice:invoiceNumber>
    <invoice:issueDate>${data.date}</invoice:issueDate>
    <invoice:dueDate>${data.dueDate}</invoice:dueDate>
  </invoice:header>
  <invoice:parties>
    <invoice:seller>
      <invoice:name>${data.sender.name}</invoice:name>
      <invoice:street>${data.sender.street || ''}</invoice:street>
      <invoice:city>${data.sender.city || ''}</invoice:city>
      <invoice:postalCode>${data.sender.postalCode || ''}</invoice:postalCode>
      <invoice:country>${data.sender.country || 'DE'}</invoice:country>
      <invoice:taxId>${data.sender.vatId || ''}</invoice:taxId>
    </invoice:seller>
    <invoice:buyer>
      <invoice:name>${data.recipient.name}</invoice:name>
      <invoice:street>${data.recipient.street || ''}</invoice:street>
      <invoice:city>${data.recipient.city || ''}</invoice:city>
      <invoice:postalCode>${data.recipient.postalCode || ''}</invoice:postalCode>
      <invoice:country>${data.recipient.country || 'DE'}</invoice:country>
    </invoice:buyer>
  </invoice:parties>
  <invoice:items>
    ${data.items.map(item => `
    <invoice:item>
      <invoice:id>${item.id}</invoice:id>
      <invoice:description>${item.description}</invoice:description>
      <invoice:quantity>${item.quantity}</invoice:quantity>
      <invoice:unitPrice>${item.unitPrice.toFixed(2)}</invoice:unitPrice>
      <invoice:totalPrice>${item.totalPrice.toFixed(2)}</invoice:totalPrice>
      <invoice:taxRate>${(item.taxRate || 19).toFixed(2)}</invoice:taxRate>
    </invoice:item>
    `).join('')}
  </invoice:items>
  <invoice:totals>
    <invoice:subtotal>${data.subtotal.toFixed(2)}</invoice:subtotal>
    <invoice:taxAmount>${data.taxAmount.toFixed(2)}</invoice:taxAmount>
    <invoice:total>${data.total.toFixed(2)}</invoice:total>
  </invoice:totals>
  <invoice:notes>${data.notes || ''}</invoice:notes>
  <invoice:paymentMethod>${data.paymentMethod || 'Transfer'}</invoice:paymentMethod>
</invoice:invoice>`;
};

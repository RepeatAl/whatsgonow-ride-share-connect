
import React from 'react';
import { Page, Document, StyleSheet } from '@react-pdf/renderer';
import { InvoiceData } from '@/utils/invoice';
import { InvoiceHeader } from './components/InvoiceHeader';
import { AddressSection } from './components/AddressSection';
import { InvoiceInfoSection } from './components/InvoiceInfoSection';
import { InvoiceItemsTable } from './components/InvoiceItemsTable';
import { InvoiceSummary } from './components/InvoiceSummary';
import { BankDetails } from './components/BankDetails';
import { InvoiceFooter } from './components/InvoiceFooter';
import { invoiceStyles } from './styles/invoiceStyles';

// Invoice PDF component
interface InvoicePDFProps {
  data: InvoiceData;
}

export const InvoicePDF = ({ data }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={invoiceStyles.page}>
      <InvoiceHeader 
        title="Rechnung"
        subtitle="Whatsgonow GmbH"
      />

      <AddressSection 
        sender={data.sender}
        recipient={data.recipient}
      />

      <InvoiceInfoSection 
        invoiceNumber={data.invoiceNumber}
        date={data.date}
        dueDate={data.dueDate}
        orderId={data.orderId}
        serviceDate={data.serviceDate}
        paymentMethod={data.paymentMethod}
      />

      <InvoiceItemsTable items={data.items} />

      <InvoiceSummary 
        subtotal={data.subtotal}
        taxAmount={data.taxAmount}
        total={data.total}
      />

      <BankDetails invoiceNumber={data.invoiceNumber} />

      <InvoiceFooter notes={data.notes} />
    </Page>
  </Document>
);

export default InvoicePDF;

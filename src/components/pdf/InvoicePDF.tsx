
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { InvoiceData } from '@/utils/invoiceGenerator';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #ccc',
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4B5563',
  },
  infoBox: {
    border: '1px solid #e5e7eb',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4B5563',
  },
  addressBox: {
    marginBottom: 20,
  },
  invoiceInfoBox: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceInfoColumn: {
    width: '48%',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  tableHeaderCell: {
    backgroundColor: '#f3f4f6',
    padding: 5,
    fontWeight: 'bold',
    flex: 1,
    color: '#374151',
    textAlign: 'center',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    color: '#4B5563',
    textAlign: 'center',
  },
  tableCellLeft: {
    padding: 5,
    flex: 2,
    color: '#4B5563',
    textAlign: 'left',
  },
  tableCellRight: {
    padding: 5,
    flex: 1,
    color: '#4B5563',
    textAlign: 'right',
  },
  summaryBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  summaryColumn: {
    width: '40%',
  },
  summaryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  summaryTotal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    paddingTop: 5,
  },
  note: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    color: '#4B5563',
  },
  footer: {
    marginTop: 20,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
    fontSize: 10,
    color: '#6B7280',
  },
  bankDetails: {
    marginTop: 20,
    marginBottom: 20,
  },
});

// Invoice PDF component
interface InvoicePDFProps {
  data: InvoiceData;
}

export const InvoicePDF = ({ data }: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Rechnung</Text>
          <Text style={styles.subtitle}>Whatsgonow GmbH</Text>
        </View>
        {/* In a real app, you would include a logo here */}
        {/* <Image style={styles.logo} src="/logo.png" /> */}
      </View>

      <View style={styles.addressBox}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Absender:</Text>
            <View style={styles.infoBox}>
              <Text>{data.sender.name}</Text>
              <Text>{data.sender.address}</Text>
              <Text>USt-IdNr: {data.sender.taxId}</Text>
              <Text>Email: {data.sender.email}</Text>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Text style={styles.sectionTitle}>Empfänger:</Text>
            <View style={styles.infoBox}>
              <Text>{data.recipient.name}</Text>
              <Text>{data.recipient.address}</Text>
              <Text>Email: {data.recipient.email}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.invoiceInfoBox}>
        <View style={styles.invoiceInfoColumn}>
          <Text style={styles.sectionTitle}>Rechnungsdetails:</Text>
          <View style={styles.infoBox}>
            <Text>Rechnungsnummer: {data.invoiceNumber}</Text>
            <Text>Rechnungsdatum: {data.date}</Text>
            <Text>Fälligkeitsdatum: {data.dueDate}</Text>
            <Text>Auftragsnummer: {data.orderId}</Text>
          </View>
        </View>
        <View style={styles.invoiceInfoColumn}>
          <Text style={styles.sectionTitle}>Leistungszeitraum:</Text>
          <View style={styles.infoBox}>
            <Text>Leistungsdatum: {data.serviceDate}</Text>
            <Text>Zahlungsmethode: {data.paymentMethod}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Positionen:</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={{ ...styles.tableHeaderCell, flex: 2 }}>Beschreibung</Text>
            <Text style={styles.tableHeaderCell}>Menge</Text>
            <Text style={styles.tableHeaderCell}>Einzelpreis (€)</Text>
            <Text style={styles.tableHeaderCell}>MwSt (%)</Text>
            <Text style={styles.tableHeaderCell}>Gesamtpreis (€)</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={{ ...styles.tableCellLeft, flex: 2 }}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{item.taxRate}</Text>
              <Text style={styles.tableCell}>{item.totalPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryColumn}>
          <View style={styles.summaryRow}>
            <Text>Nettobetrag:</Text>
            <Text>{data.subtotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>MwSt (19%):</Text>
            <Text>{data.taxAmount.toFixed(2)} €</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text>Gesamtbetrag:</Text>
            <Text>{data.total.toFixed(2)} €</Text>
          </View>
        </View>
      </View>

      <View style={styles.bankDetails}>
        <Text style={styles.sectionTitle}>Bankverbindung:</Text>
        <View style={styles.infoBox}>
          <Text>Empfänger: Whatsgonow GmbH</Text>
          <Text>IBAN: DE12 3456 7890 1234 5678 90</Text>
          <Text>BIC: DEUTDEFFXXX</Text>
          <Text>Bank: Deutsche Bank</Text>
          <Text>Verwendungszweck: {data.invoiceNumber}</Text>
        </View>
      </View>

      <View style={styles.note}>
        <Text>{data.notes}</Text>
      </View>

      <View style={styles.footer}>
        <Text>© {new Date().getFullYear()} Whatsgonow GmbH - Musterstraße 123, 10115 Berlin</Text>
        <Text>Telefon: +49 30 12345678 - E-Mail: buchhaltung@whatsgonow.de - Web: www.whatsgonow.de</Text>
        <Text>Geschäftsführer: Max Mustermann - Handelsregister: HRB 123456 Amtsgericht Berlin-Charlottenburg</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;

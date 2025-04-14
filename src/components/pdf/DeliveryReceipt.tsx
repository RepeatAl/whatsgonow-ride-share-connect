
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from '@/utils/pdfGenerator';

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
    marginBottom: 20,
    color: '#374151',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
    color: '#4B5563',
  },
  orderInfo: {
    marginBottom: 20,
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
  },
  tableCell: {
    padding: 5,
    flex: 1,
    color: '#4B5563',
  },
  footer: {
    marginTop: 30,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
    fontSize: 10,
    color: '#6B7280',
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    color: '#4B5563',
  },
  infoBox: {
    border: '1px solid #e5e7eb',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});

// Receipt PDF component
interface DeliveryReceiptProps {
  data: {
    orderId: string;
    date: string;
    sender: {
      name: string;
      address: string;
    };
    driver: {
      name: string;
      id: string;
    };
    price: number;
    route: {
      origin: string;
      destination: string;
      distance: string;
    };
    weight: string;
    rating: number | string;
    status: string;
  };
}

export const DeliveryReceipt = ({ data }: DeliveryReceiptProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lieferquittung</Text>
          <Text style={styles.subtitle}>Whatsgonow Crowdlogistik</Text>
        </View>
        {/* In a real app, you might want to include a logo here */}
        {/* <Image style={styles.logo} src="/logo.png" /> */}
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.sectionTitle}>Auftragsinformationen</Text>
        <View style={styles.infoBox}>
          <Text>Auftrag-ID: {data.orderId}</Text>
          <Text>Datum: {formatDate(data.date)}</Text>
          <Text>Status: {data.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Absender</Text>
        <View style={styles.infoBox}>
          <Text>{data.sender.name}</Text>
          <Text>{data.sender.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lieferant</Text>
        <View style={styles.infoBox}>
          <Text>{data.driver.name}</Text>
          <Text>ID: {data.driver.id}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lieferdetails</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>Beschreibung</Text>
            <Text style={styles.tableHeaderCell}>Wert</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Preis</Text>
            <Text style={styles.tableCell}>{data.price.toFixed(2)} €</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Strecke</Text>
            <Text style={styles.tableCell}>{data.route.distance}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Abholadresse</Text>
            <Text style={styles.tableCell}>{data.route.origin}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Lieferadresse</Text>
            <Text style={styles.tableCell}>{data.route.destination}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Gewicht</Text>
            <Text style={styles.tableCell}>{data.weight}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Bewertung</Text>
            <Text style={styles.tableCell}>{data.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.note}>
        <Text>Dieses Dokument dient als Lieferbestätigung für den oben genannten Auftrag.</Text>
      </View>

      <View style={styles.footer}>
        <Text>© {new Date().getFullYear()} Whatsgonow Crowdlogistik</Text>
        <Text>Automatisch generierte Quittung - Keine Unterschrift erforderlich</Text>
      </View>
    </Page>
  </Document>
);

export default DeliveryReceipt;

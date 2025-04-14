
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';
import { InvoiceItem } from '@/utils/invoice';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ 
  items 
}) => (
  <View style={invoiceStyles.section}>
    <Text style={invoiceStyles.sectionTitle}>Positionen:</Text>
    <View style={invoiceStyles.table}>
      <View style={invoiceStyles.tableRow}>
        <Text style={{ ...invoiceStyles.tableHeaderCell, flex: 2 }}>Beschreibung</Text>
        <Text style={invoiceStyles.tableHeaderCell}>Menge</Text>
        <Text style={invoiceStyles.tableHeaderCell}>Einzelpreis (€)</Text>
        <Text style={invoiceStyles.tableHeaderCell}>MwSt (%)</Text>
        <Text style={invoiceStyles.tableHeaderCell}>Gesamtpreis (€)</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={invoiceStyles.tableRow}>
          <Text style={{ ...invoiceStyles.tableCellLeft, flex: 2 }}>{item.description}</Text>
          <Text style={invoiceStyles.tableCell}>{item.quantity}</Text>
          <Text style={invoiceStyles.tableCell}>{item.unitPrice.toFixed(2)}</Text>
          <Text style={invoiceStyles.tableCell}>{item.taxRate}</Text>
          <Text style={invoiceStyles.tableCell}>{item.totalPrice.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  </View>
);

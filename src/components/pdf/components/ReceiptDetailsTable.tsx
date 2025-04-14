
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { receiptStyles } from '../styles/receiptStyles';

interface TableRowProps {
  label: string;
  value: string | number;
}

interface ReceiptDetailsTableProps {
  rows: TableRowProps[];
}

export const ReceiptDetailsTable: React.FC<ReceiptDetailsTableProps> = ({ rows }) => (
  <View style={receiptStyles.section}>
    <Text style={receiptStyles.sectionTitle}>Lieferdetails</Text>
    <View style={receiptStyles.table}>
      <View style={receiptStyles.tableRow}>
        <Text style={receiptStyles.tableHeaderCell}>Beschreibung</Text>
        <Text style={receiptStyles.tableHeaderCell}>Wert</Text>
      </View>
      
      {rows.map((row, i) => (
        <View key={i} style={receiptStyles.tableRow}>
          <Text style={receiptStyles.tableCell}>{row.label}</Text>
          <Text style={receiptStyles.tableCell}>{row.value}</Text>
        </View>
      ))}
    </View>
  </View>
);

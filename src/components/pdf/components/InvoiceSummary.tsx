
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';

interface InvoiceSummaryProps {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ 
  subtotal, 
  taxAmount, 
  total 
}) => (
  <View style={invoiceStyles.summaryBox}>
    <View style={invoiceStyles.summaryColumn}>
      <View style={invoiceStyles.summaryRow}>
        <Text>Nettobetrag:</Text>
        <Text>{subtotal.toFixed(2)} €</Text>
      </View>
      <View style={invoiceStyles.summaryRow}>
        <Text>MwSt (19%):</Text>
        <Text>{taxAmount.toFixed(2)} €</Text>
      </View>
      <View style={invoiceStyles.summaryTotal}>
        <Text>Gesamtbetrag:</Text>
        <Text>{total.toFixed(2)} €</Text>
      </View>
    </View>
  </View>
);


import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { receiptStyles } from '../styles/receiptStyles';

interface ReceiptFooterProps {
  noteText: string;
  year: number;
  companyName: string;
}

export const ReceiptFooter: React.FC<ReceiptFooterProps> = ({ 
  noteText, 
  year, 
  companyName 
}) => (
  <>
    <View style={receiptStyles.note}>
      <Text>{noteText}</Text>
    </View>

    <View style={receiptStyles.footer}>
      <Text>© {year} {companyName}</Text>
      <Text>Automatisch generierte Quittung - Keine Unterschrift erforderlich</Text>
    </View>
  </>
);

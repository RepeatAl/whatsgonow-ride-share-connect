
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { receiptStyles } from '../styles/receiptStyles';

interface ReceiptOrderInfoProps {
  orderId: string;
  date: string;
  status: string;
}

export const ReceiptOrderInfo: React.FC<ReceiptOrderInfoProps> = ({ 
  orderId, 
  date, 
  status 
}) => (
  <View style={receiptStyles.orderInfo}>
    <Text style={receiptStyles.sectionTitle}>Auftragsinformationen</Text>
    <View style={receiptStyles.infoBox}>
      <Text>Auftrag-ID: {orderId}</Text>
      <Text>Datum: {date}</Text>
      <Text>Status: {status}</Text>
    </View>
  </View>
);

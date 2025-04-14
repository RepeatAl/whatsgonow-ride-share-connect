
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { receiptStyles } from '../styles/receiptStyles';

interface AddressSectionProps {
  title: string;
  name: string;
  address?: string;
  id?: string;
}

export const ReceiptAddressSection: React.FC<AddressSectionProps> = ({ 
  title, 
  name, 
  address, 
  id 
}) => (
  <View style={receiptStyles.section}>
    <Text style={receiptStyles.sectionTitle}>{title}</Text>
    <View style={receiptStyles.infoBox}>
      <Text>{name}</Text>
      {address && <Text>{address}</Text>}
      {id && <Text>ID: {id}</Text>}
    </View>
  </View>
);

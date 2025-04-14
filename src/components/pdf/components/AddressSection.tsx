
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';

interface SenderRecipientInfo {
  name: string;
  address: string;
  taxId?: string;
  email: string;
  website?: string;
}

interface AddressSectionProps {
  sender: SenderRecipientInfo;
  recipient: SenderRecipientInfo;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ 
  sender, 
  recipient 
}) => (
  <View style={invoiceStyles.addressBox}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text style={invoiceStyles.sectionTitle}>Absender:</Text>
        <View style={invoiceStyles.infoBox}>
          <Text>{sender.name}</Text>
          <Text>{sender.address}</Text>
          {sender.taxId && <Text>USt-IdNr: {sender.taxId}</Text>}
          <Text>Email: {sender.email}</Text>
        </View>
      </View>
      <View style={{ flex: 1, marginLeft: 20 }}>
        <Text style={invoiceStyles.sectionTitle}>Empfänger:</Text>
        <View style={invoiceStyles.infoBox}>
          <Text>{recipient.name}</Text>
          <Text>{recipient.address}</Text>
          <Text>Email: {recipient.email}</Text>
        </View>
      </View>
    </View>
  </View>
);

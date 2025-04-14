
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';
import { InvoiceAddress } from '@/utils/invoice/invoiceTypes';

interface SenderRecipientInfo {
  name: string;
  address: string;
  taxId?: string;
  email: string;
  website?: string;
}

// Modified props to accept either InvoiceAddress or SenderRecipientInfo
interface AddressSectionProps {
  sender: InvoiceAddress | SenderRecipientInfo;
  recipient: InvoiceAddress | SenderRecipientInfo;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ 
  sender, 
  recipient 
}) => {
  // Helper function to format address from InvoiceAddress type
  const formatAddress = (addr: InvoiceAddress | SenderRecipientInfo): string => {
    if ('address' in addr && addr.address) {
      return addr.address;
    } else if ('street' in addr) {
      // Combine street, city, postalCode for InvoiceAddress
      const parts = [];
      if (addr.street) parts.push(addr.street);
      if (addr.postalCode) parts.push(addr.postalCode);
      if (addr.city) parts.push(addr.city);
      return parts.join(', ');
    }
    return '';
  };

  return (
    <View style={invoiceStyles.addressBox}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={invoiceStyles.sectionTitle}>Absender:</Text>
          <View style={invoiceStyles.infoBox}>
            <Text>{sender.name}</Text>
            <Text>{formatAddress(sender)}</Text>
            {/* Use conditionals to check property existence */}
            {('taxId' in sender && sender.taxId) && <Text>USt-IdNr: {sender.taxId}</Text>}
            {('vatId' in sender && sender.vatId) && <Text>USt-IdNr: {sender.vatId}</Text>}
            <Text>Email: {sender.email}</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={invoiceStyles.sectionTitle}>Empfänger:</Text>
          <View style={invoiceStyles.infoBox}>
            <Text>{recipient.name}</Text>
            <Text>{formatAddress(recipient)}</Text>
            <Text>Email: {recipient.email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

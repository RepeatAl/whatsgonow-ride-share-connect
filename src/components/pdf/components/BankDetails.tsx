
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';

interface BankDetailsProps {
  invoiceNumber: string;
}

export const BankDetails: React.FC<BankDetailsProps> = ({ 
  invoiceNumber 
}) => (
  <View style={invoiceStyles.bankDetails}>
    <Text style={invoiceStyles.sectionTitle}>Bankverbindung:</Text>
    <View style={invoiceStyles.infoBox}>
      <Text>Empfänger: Whatsgonow GmbH</Text>
      <Text>IBAN: DE12 3456 7890 1234 5678 90</Text>
      <Text>BIC: DEUTDEFFXXX</Text>
      <Text>Bank: Deutsche Bank</Text>
      <Text>Verwendungszweck: {invoiceNumber}</Text>
      <Text>USt-ID: DE123456789</Text>
    </View>
  </View>
);

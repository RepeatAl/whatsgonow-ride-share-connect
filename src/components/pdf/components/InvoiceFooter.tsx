
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';

interface InvoiceFooterProps {
  notes: string;
}

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ 
  notes 
}) => (
  <>
    <View style={invoiceStyles.note}>
      <Text>{notes}</Text>
    </View>

    <View style={invoiceStyles.footer}>
      <Text>© {new Date().getFullYear()} Whatsgonow GmbH - Startup Allee 42, 10115 Berlin</Text>
      <Text>Telefon: +49 30 12345678 - E-Mail: buchhaltung@whatsgonow.de - Web: www.whatsgonow.de</Text>
      <Text>Geschäftsführer: Max Mustermann - USt-ID: DE123456789 - Handelsregister: HRB 123456 Amtsgericht Berlin-Charlottenburg</Text>
      <Text>Bankverbindung: Deutsche Bank - IBAN: DE12 3456 7890 1234 5678 90 - BIC: DEUTDEFFXXX</Text>
    </View>
  </>
);

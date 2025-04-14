
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
      <Text>© {new Date().getFullYear()} Whatsgonow GmbH - Musterstraße 123, 10115 Berlin</Text>
      <Text>Telefon: +49 30 12345678 - E-Mail: buchhaltung@whatsgonow.de - Web: www.whatsgonow.de</Text>
      <Text>Geschäftsführer: Max Mustermann - Handelsregister: HRB 123456 Amtsgericht Berlin-Charlottenburg</Text>
    </View>
  </>
);

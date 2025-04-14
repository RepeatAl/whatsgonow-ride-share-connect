
import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';

interface InvoiceHeaderProps {
  title: string;
  subtitle: string;
  logoSrc?: string;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ 
  title, 
  subtitle, 
  logoSrc 
}) => (
  <View style={invoiceStyles.header}>
    <View>
      <Text style={invoiceStyles.title}>{title}</Text>
      <Text style={invoiceStyles.subtitle}>{subtitle}</Text>
    </View>
    {logoSrc ? (
      <Image style={invoiceStyles.logo} src={logoSrc} />
    ) : (
      <Text style={invoiceStyles.logoText}>Whatsgonow GmbH</Text>
    )}
  </View>
);

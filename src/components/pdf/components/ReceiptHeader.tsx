
import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';
import { receiptStyles } from '../styles/receiptStyles';

interface ReceiptHeaderProps {
  title: string;
  subtitle: string;
  logoSrc?: string;
}

export const ReceiptHeader: React.FC<ReceiptHeaderProps> = ({ 
  title, 
  subtitle, 
  logoSrc 
}) => (
  <View style={receiptStyles.header}>
    <View>
      <Text style={receiptStyles.title}>{title}</Text>
      <Text style={receiptStyles.subtitle}>{subtitle}</Text>
    </View>
    {logoSrc && <Image style={receiptStyles.logo} src={logoSrc} />}
  </View>
);

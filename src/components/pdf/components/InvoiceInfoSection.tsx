
import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { invoiceStyles } from '../styles/invoiceStyles';

interface InvoiceInfoSectionProps {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  orderId: string;
  serviceDate: string;
  paymentMethod: string;
}

export const InvoiceInfoSection: React.FC<InvoiceInfoSectionProps> = ({ 
  invoiceNumber, 
  date, 
  dueDate, 
  orderId,
  serviceDate,
  paymentMethod
}) => (
  <View style={invoiceStyles.invoiceInfoBox}>
    <View style={invoiceStyles.invoiceInfoColumn}>
      <Text style={invoiceStyles.sectionTitle}>Rechnungsdetails:</Text>
      <View style={invoiceStyles.infoBox}>
        <Text>Rechnungsnummer: {invoiceNumber}</Text>
        <Text>Rechnungsdatum: {date}</Text>
        <Text>Fälligkeitsdatum: {dueDate}</Text>
        <Text>Auftragsnummer: {orderId}</Text>
      </View>
    </View>
    <View style={invoiceStyles.invoiceInfoColumn}>
      <Text style={invoiceStyles.sectionTitle}>Leistungszeitraum:</Text>
      <View style={invoiceStyles.infoBox}>
        <Text>Leistungsdatum: {serviceDate}</Text>
        <Text>Zahlungsmethode: {paymentMethod}</Text>
      </View>
    </View>
  </View>
);

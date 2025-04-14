
import React from 'react';
import { Page, Document } from '@react-pdf/renderer';
import { formatDate } from '@/utils/pdfGenerator';
import { receiptStyles } from './styles/receiptStyles';
import { ReceiptHeader } from './components/ReceiptHeader';
import { ReceiptOrderInfo } from './components/ReceiptOrderInfo';
import { ReceiptAddressSection } from './components/ReceiptAddressSection';
import { ReceiptDetailsTable } from './components/ReceiptDetailsTable';
import { ReceiptFooter } from './components/ReceiptFooter';

// Receipt PDF component
interface DeliveryReceiptProps {
  data: {
    orderId: string;
    date: string;
    sender: {
      name: string;
      address: string;
    };
    driver: {
      name: string;
      id: string;
    };
    price: number;
    route: {
      origin: string;
      destination: string;
      distance: string;
    };
    weight: string;
    rating: number | string;
    status: string;
  };
}

export const DeliveryReceipt = ({ data }: DeliveryReceiptProps) => {
  const detailRows = [
    { label: 'Preis', value: `${data.price.toFixed(2)} €` },
    { label: 'Strecke', value: data.route.distance },
    { label: 'Abholadresse', value: data.route.origin },
    { label: 'Lieferadresse', value: data.route.destination },
    { label: 'Gewicht', value: data.weight },
    { label: 'Bewertung', value: data.rating },
  ];

  return (
    <Document>
      <Page size="A4" style={receiptStyles.page}>
        <ReceiptHeader 
          title="Lieferquittung" 
          subtitle="Whatsgonow Crowdlogistik" 
        />

        <ReceiptOrderInfo 
          orderId={data.orderId} 
          date={formatDate(data.date)} 
          status={data.status} 
        />

        <ReceiptAddressSection 
          title="Absender" 
          name={data.sender.name} 
          address={data.sender.address} 
        />

        <ReceiptAddressSection 
          title="Lieferant" 
          name={data.driver.name} 
          id={data.driver.id} 
        />

        <ReceiptDetailsTable rows={detailRows} />

        <ReceiptFooter 
          noteText="Dieses Dokument dient als Lieferbestätigung für den oben genannten Auftrag." 
          year={new Date().getFullYear()} 
          companyName="Whatsgonow Crowdlogistik" 
        />
      </Page>
    </Document>
  );
};

export default DeliveryReceipt;

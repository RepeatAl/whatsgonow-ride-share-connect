
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Function to generate a simple PDF as Blob
const generateTestPDF = (): Blob => {
  // Simple PDF structure
  const pdfContent = `
    %PDF-1.4
    1 0 obj
    << /Type /Catalog
       /Pages 2 0 R
    >>
    endobj
    2 0 obj
    << /Type /Pages
       /Kids [3 0 R]
       /Count 1
    >>
    endobj
    3 0 obj
    << /Type /Page
       /Parent 2 0 R
       /Resources << /Font << /F1 4 0 R >> >>
       /MediaBox [0 0 612 792]
       /Contents 5 0 R
    >>
    endobj
    4 0 obj
    << /Type /Font
       /Subtype /Type1
       /Name /F1
       /BaseFont /Helvetica
    >>
    endobj
    5 0 obj
    << /Length 67 >>
    stream
    BT
    /F1 24 Tf
    100 700 Td
    (Whatsgonow Test PDF Document) Tj
    ET
    endstream
    endobj
    xref
    0 6
    0000000000 65535 f
    0000000009 00000 n
    0000000063 00000 n
    0000000122 00000 n
    0000000259 00000 n
    0000000348 00000 n
    trailer
    << /Size 6
       /Root 1 0 R
    >>
    startxref
    465
    %%EOF
  `;
  return new Blob([pdfContent], { type: 'application/pdf' });
};

// Function to generate a simple XML as Blob
const generateTestXML = (): Blob => {
  // Simplified XRechnung structure
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_2.0</cbc:CustomizationID>
  <cbc:ID>WGN-TEST-2025-001</cbc:ID>
  <cbc:IssueDate>2025-04-14</cbc:IssueDate>
  <cbc:DueDate>2025-05-14</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
  <cbc:BuyerReference>TEST-ORDER-123</cbc:BuyerReference>
  
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>Whatsgonow GmbH</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>Musterstraße 123</cbc:StreetName>
        <cbc:CityName>Berlin</cbc:CityName>
        <cbc:PostalZone>10115</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>DE123456789</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VA</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>
  
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>Test Kunde</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>Testweg 1</cbc:StreetName>
        <cbc:CityName>Berlin</cbc:CityName>
        <cac:Country>
          <cbc:IdentificationCode>DE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
    </cac:Party>
  </cac:AccountingCustomerParty>
  
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">100.00</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">100.00</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">119.00</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">119.00</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity>1</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="EUR">100.00</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>Testdienstleistung</cbc:Description>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="EUR">100.00</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
</ubl:Invoice>`;
  return new Blob([xmlContent], { type: 'application/xml' });
};

const TestEmailSender: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{success: boolean, message: string} | null>(null);

  const sendTestEmail = async () => {
    setSending(true);
    setLastResult(null);
    
    try {
      // Generate test attachments
      const pdfBlob = generateTestPDF();
      const xmlBlob = generateTestXML();
      
      // Create FormData object
      const formData = new FormData();
      formData.append('to', 'admin@whatsgonow.com');
      formData.append('subject', 'Whatsgonow – Testmail mit Anhang');
      formData.append('body', 'Dies ist ein automatischer Testversand aus Lovable. Im Anhang findest du eine Test-PDF und eine Test-XRechnung.');
      
      // Add attachments with unique keys
      formData.append('attachment_1', new File([pdfBlob], 'whatsgonow_test.pdf', { type: 'application/pdf' }));
      formData.append('attachment_2', new File([xmlBlob], 'whatsgonow_xrechnung.xml', { type: 'application/xml' }));
      
      // Send request to edge function
      const response = await fetch('https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/send-email', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Fehler beim Senden der Test-E-Mail');
      }
      
      // Show success toast
      toast({
        title: "E-Mail versendet",
        description: `Die Test-E-Mail wurde erfolgreich an ${result.to} versendet.`,
      });
      
      setLastResult({
        success: true,
        message: `E-Mail erfolgreich versendet an ${result.to} (Message-ID: ${result.messageId})`
      });
      
    } catch (error) {
      console.error('Error sending test email:', error);
      
      // Show error toast
      toast({
        title: "Fehler beim Senden",
        description: error instanceof Error ? error.message : 'Unbekannter Fehler beim E-Mail-Versand',
        variant: "destructive"
      });
      
      setLastResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unbekannter Fehler beim E-Mail-Versand'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>E-Mail-Versand Tester</CardTitle>
        <CardDescription>
          Versendet eine Test-E-Mail mit PDF- und XML-Anhang an admin@whatsgonow.com
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={sendTestEmail} 
          disabled={sending}
          className="w-full"
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sende Test-E-Mail...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Test-E-Mail senden
            </>
          )}
        </Button>
        
        {lastResult && (
          <Alert variant={lastResult.success ? "default" : "destructive"}>
            <AlertDescription>
              {lastResult.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TestEmailSender;

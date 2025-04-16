import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { checkResendApiKey, testEmailConnection } from "@/utils/email-connection-tester";
import { supabase } from "@/lib/supabaseClient";

const generateTestPDF = (): Blob => {
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

const generateTestXML = (): Blob => {
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

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const TestEmailSender: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{success: boolean, message: string} | null>(null);
  const [emailTo, setEmailTo] = useState("admin@whatsgonow.com");
  const [checking, setChecking] = useState(false);
  const [resendApiKeyExists, setResendApiKeyExists] = useState<boolean | null>(null);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    setChecking(true);
    try {
      const hasResendKey = await checkResendApiKey();
      setResendApiKeyExists(hasResendKey);
      
      if (!hasResendKey) {
        toast({
          title: "Konfigurationsproblem",
          description: "RESEND_API_KEY ist in den Supabase-Funktionen nicht konfiguriert",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Fehler bei der Konfigurationsprüfung:", error);
    } finally {
      setChecking(false);
    }
  };

  const sendTestEmail = async () => {
    setSending(true);
    setLastResult(null);
    
    try {
      const testResult = await testEmailConnection(emailTo);
      
      if (!testResult) {
        throw new Error("Basis-E-Mail-Versand fehlgeschlagen");
      }
      
      const pdfBlob = generateTestPDF();
      const xmlBlob = generateTestXML();
      
      console.log("Generated PDF size:", pdfBlob.size, "bytes");
      console.log("Generated XML size:", xmlBlob.size, "bytes");
      
      const pdfBase64 = await blobToBase64(pdfBlob);
      const xmlBase64 = await blobToBase64(xmlBlob);
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: emailTo,
          subject: 'Whatsgonow – Testmail mit Anhang',
          html: 'Dies ist ein automatischer Testversand aus der Whatsgonow-App. Im Anhang findest du eine Test-PDF und eine Test-XRechnung.',
          attachments: [
            {
              filename: 'whatsgonow_test.pdf',
              content: pdfBase64,
              type: 'application/pdf'
            },
            {
              filename: 'whatsgonow_xrechnung.xml',
              content: xmlBase64,
              type: 'application/xml'
            }
          ]
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Fehler beim Senden der E-Mail mit Anhängen');
      }
      
      toast({
        title: "E-Mail versendet",
        description: `Die Test-E-Mail wurde erfolgreich an ${emailTo} versendet.`,
      });
      
      setLastResult({
        success: true,
        message: `E-Mail erfolgreich versendet an ${emailTo}`
      });
      
    } catch (error) {
      console.error('Error sending test email:', error);
      
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
          Versendet eine Test-E-Mail mit PDF- und XML-Anhang
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resendApiKeyExists === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Konfigurationsproblem</AlertTitle>
            <AlertDescription>
              Der RESEND_API_KEY ist nicht in den Supabase-Funktionen konfiguriert. 
              E-Mail-Versand wird nicht funktionieren, bis dies behoben ist.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <label htmlFor="emailTo" className="text-sm font-medium">E-Mail-Empfänger</label>
          <Input 
            id="emailTo" 
            type="email" 
            value={emailTo} 
            onChange={(e) => setEmailTo(e.target.value)} 
            placeholder="empfaenger@example.com" 
          />
        </div>
        
        <Button 
          onClick={sendTestEmail} 
          disabled={sending || resendApiKeyExists === false}
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
        
        <Button 
          onClick={checkConfiguration} 
          disabled={checking}
          variant="outline"
          className="w-full"
        >
          {checking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Prüfe Konfiguration...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Konfiguration prüfen
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
      <CardFooter className="text-xs text-muted-foreground">
        Bei der Registrierung wird die gleiche Supabase Edge Function verwendet.
      </CardFooter>
    </Card>
  );
};

export default TestEmailSender;

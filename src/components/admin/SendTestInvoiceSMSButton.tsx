
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { detailedInvoiceService } from '@/services/invoice/detailedInvoiceService';
import { emailService } from '@/services/invoice/emailService';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const SendTestInvoiceSMSButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    invoiceId?: string;
    downloadLink?: string;
    pin?: string;
  } | null>(null);

  const handleTestSend = async () => {
    try {
      setLoading(true);
      setResult(null);

      // Create a test invoice
      const testInvoiceData = {
        sender_id: 'test-sender',
        amount: 42.99,
        currency: 'EUR',
        senderAddress: {
          company_name: 'Test GmbH',
          street: 'Teststraße',
          building_number: '123',
          postal_code: '12345',
          city: 'Berlin',
          country: 'DE',
          entity_type: 'sender'
        },
        recipientAddress: {
          company_name: 'Empfänger AG',
          street: 'Empfängerweg',
          building_number: '456',
          postal_code: '54321',
          city: 'München',
          country: 'DE',
          entity_type: 'recipient'
        },
        lineItems: [
          {
            description: 'Test Lieferung',
            quantity: 1,
            unit_price: 42.99,
            unit_of_measure: 'Stück',
            total_price: 42.99
          }
        ]
      };

      // Create the invoice
      const invoice = await detailedInvoiceService.createDetailedInvoice(testInvoiceData);

      if (!invoice?.invoice_id) {
        throw new Error('Fehler beim Erstellen der Testrechnung');
      }

      // Send SMS with PIN
      const testPhone = '+49123456789'; // Should be configurable in production
      const success = await emailService.sendInvoiceSMS(
        invoice.invoice_id,
        testPhone,
        true // Include PIN
      );

      if (!success) {
        throw new Error('SMS konnte nicht gesendet werden');
      }

      // Get the latest token for this invoice
      const { data: tokenData } = await supabase
        .from('invoice_sms_tokens')
        .select('*')
        .eq('invoice_id', invoice.invoice_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!tokenData) {
        throw new Error('Token nicht gefunden');
      }

      setResult({
        invoiceId: invoice.invoice_id,
        downloadLink: `https://app.whatsgonow.com/invoice-download/${tokenData.token}`,
        pin: tokenData.pin
      });

      toast({
        title: 'Test-SMS gesendet',
        description: 'Die Rechnung wurde erfolgreich erstellt und die SMS versendet.'
      });
    } catch (error) {
      console.error('Error in test flow:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Ein unerwarteter Fehler ist aufgetreten',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleTestSend} 
        disabled={loading}
        variant="outline"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Test läuft...
          </>
        ) : (
          'Test-Rechnung per SMS senden'
        )}
      </Button>

      {result && (
        <Card className="p-4 space-y-2 bg-muted">
          <h3 className="font-medium">Test-Ergebnisse:</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Rechnungs-ID:</span> {result.invoiceId}</p>
            <p><span className="font-medium">Download-Link:</span> <br/>
              <a href={result.downloadLink} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline break-all">
                {result.downloadLink}
              </a>
            </p>
            <p><span className="font-medium">PIN:</span> {result.pin}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

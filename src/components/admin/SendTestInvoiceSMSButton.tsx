
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testInvoiceService } from '@/services/invoice/testInvoiceService';
import { emailService } from '@/services/invoice/emailService';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { TestInvoiceResults } from './TestInvoiceResults';
import { supabase } from '@/lib/supabaseClient';

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

      // Create test invoice
      const invoice = await testInvoiceService.createTestInvoice();

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

      // Get the latest token
      const tokenData = await testInvoiceService.getLatestToken(invoice.invoice_id);

      if (!tokenData) {
        throw new Error('Token nicht gefunden');
      }

      setResult({
        invoiceId: invoice.invoice_id,
        downloadLink: `${window.location.origin}/invoice-download/${tokenData.token}`,
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

      {result && <TestInvoiceResults result={result} />}
    </div>
  );
};

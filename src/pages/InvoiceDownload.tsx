
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const InvoiceDownload: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [pin, setPin] = useState('');
  const [tokenData, setTokenData] = useState<any>(null);
  const [requirePin, setRequirePin] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('invoice_sms_tokens')
          .select('*')
          .eq('token', token)
          .single();

        if (error || !data) {
          throw new Error('Ungültiger oder abgelaufener Link');
        }

        // Check token validity
        const now = new Date();
        const expiresAt = new Date(data.expires_at);
        const isExpired = now > expiresAt;
        const isUsed = data.used;

        if (isExpired || isUsed) {
          throw new Error('Der Download-Link ist nicht mehr gültig');
        }

        setTokenData(data);
        setRequirePin(!!data.pin);

        // If no PIN required, fetch invoice URL immediately
        if (!data.pin) {
          await fetchInvoiceUrl(data.invoice_id);
        }
      } catch (error) {
        toast({
          title: "Fehler",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    fetchTokenDetails();
  }, [token]);

  const fetchInvoiceUrl = async (invoiceId: string) => {
    try {
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('invoices')
        .createSignedUrl(`${invoiceId}/invoice.pdf`, 300); // 5 minutes

      if (storageError || !storageData) {
        throw new Error('Rechnung konnte nicht heruntergeladen werden');
      }

      setDownloadUrl(storageData.signedUrl);

      // Mark token as used
      await supabase
        .from('invoice_sms_tokens')
        .update({ used: true })
        .eq('token', token);
    } catch (error) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handlePinSubmit = async () => {
    if (!tokenData || !tokenData.pin) return;

    if (pin === tokenData.pin) {
      await fetchInvoiceUrl(tokenData.invoice_id);
    } else {
      toast({
        title: "Fehler",
        description: "Ungültige PIN",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          {requirePin && !downloadUrl ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">PIN-Verifizierung</h2>
              <Input 
                type="text" 
                placeholder="Geben Sie die PIN ein" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
              />
              <Button 
                onClick={handlePinSubmit} 
                className="w-full mt-4"
              >
                PIN überprüfen
              </Button>
            </div>
          ) : downloadUrl ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Rechnung herunterladen</h2>
              <Button 
                onClick={handleDownload} 
                className="w-full"
              >
                Rechnung herunterladen
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Link ungültig</h2>
              <p>Der Download-Link ist nicht mehr gültig oder abgelaufen.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceDownload;

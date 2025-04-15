
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';

const InvoiceDownload: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [pin, setPin] = useState('');
  const [tokenData, setTokenData] = useState<any>(null);
  const [requirePin, setRequirePin] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        setLoading(true);
        setError(null);

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

        if (isExpired) {
          throw new Error('Der Download-Link ist abgelaufen');
        }

        if (isUsed) {
          throw new Error('Der Download-Link wurde bereits verwendet');
        }

        setTokenData(data);
        setRequirePin(!!data.pin);

        // Fetch invoice details
        if (data.invoice_id) {
          const { data: invoiceData, error: invoiceError } = await supabase
            .from('invoices')
            .select('*, orders(*)')
            .eq('invoice_id', data.invoice_id)
            .single();
            
          if (!invoiceError && invoiceData) {
            setInvoiceDetails(invoiceData);
          }
        }

        // If no PIN required, fetch invoice URL immediately
        if (!data.pin) {
          await fetchInvoiceUrl(data.invoice_id);
        }
      } catch (error) {
        setError(error.message);
        toast({
          title: "Fehler",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTokenDetails();
    }
  }, [token]);

  const fetchInvoiceUrl = async (invoiceId: string) => {
    try {
      setLoading(true);
      
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
        
      // Log access
      await logAccess(invoiceId, 'downloaded');
      
    } catch (error) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive"
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logAccess = async (invoiceId: string, status: string) => {
    try {
      // Get user agent and other details
      const userAgent = navigator.userAgent;
      
      if (!tokenData?.token_id) return;
      
      await supabase
        .from('invoice_access_log')
        .insert({
          invoice_id: invoiceId,
          token_id: tokenData.token_id,
          user_agent: userAgent,
          status: status,
          details: { pin_required: requirePin }
        });
    } catch (error) {
      console.error('Error logging access:', error);
    }
  };

  const handlePinSubmit = async () => {
    if (!tokenData || !tokenData.pin) return;

    if (pin === tokenData.pin) {
      await fetchInvoiceUrl(tokenData.invoice_id);
    } else {
      setError('Ungültige PIN');
      await logAccess(tokenData.invoice_id, 'pin_failed');
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

  if (loading && !error) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">Verifizierung läuft...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="text-2xl font-bold text-center mb-6">Rechnung herunterladen</h1>
          
          {error ? (
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
              <h2 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Zugriff nicht möglich</h2>
              <p>{error}</p>
            </div>
          ) : requirePin && !downloadUrl ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">PIN-Verifizierung</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bitte geben Sie die PIN ein, die Sie per SMS erhalten haben.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="pin">PIN Code</Label>
                <Input 
                  id="pin"
                  type="text" 
                  placeholder="4-stellige PIN eingeben"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  className="text-center text-xl tracking-widest"
                />
              </div>
              
              <Button 
                onClick={handlePinSubmit} 
                className="w-full"
                disabled={pin.length !== 4 || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Überprüfe...
                  </>
                ) : (
                  'PIN überprüfen'
                )}
              </Button>
            </div>
          ) : downloadUrl ? (
            <div className="space-y-4">
              {invoiceDetails && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-gray-500 dark:text-gray-400">Auftrag:</span>
                    <span className="font-medium">{invoiceDetails.orders?.description || '-'}</span>
                    
                    <span className="text-gray-500 dark:text-gray-400">Betrag:</span>
                    <span className="font-medium">{invoiceDetails.amount} {invoiceDetails.currency}</span>
                    
                    <span className="text-gray-500 dark:text-gray-400">Datum:</span>
                    <span className="font-medium">
                      {new Date(invoiceDetails.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <Button 
                  onClick={handleDownload} 
                  size="lg"
                  className="w-full"
                >
                  Rechnung herunterladen
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                Dieser Download-Link ist nur einmalig gültig.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceDownload;

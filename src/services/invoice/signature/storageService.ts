
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";

/**
 * Store signature and public key in database
 * @param invoiceId The ID of the invoice
 * @param signatureBase64 The base64-encoded signature
 * @param publicKeyPEM The public key in PEM format
 * @returns Success status
 */
export async function storeSignatureInDatabase(
  invoiceId: string,
  signatureBase64: string,
  publicKeyPEM: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("invoices")
      .update({
        digital_signature: {
          signature: signatureBase64,
          publicKey: publicKeyPEM,
          algorithm: 'RSASSA-PKCS1-v1_5',
          hashAlgorithm: 'SHA-256',
          created: new Date().toISOString()
        }
      })
      .eq("invoice_id", invoiceId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error storing signature:", error);
    toast({
      title: "Speicherfehler",
      description: "Die Signatur konnte nicht gespeichert werden.",
      variant: "destructive"
    });
    return false;
  }
}


import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";

/**
 * Sign an invoice hash with a private key
 * @param privateKey The private key to sign with
 * @param hashBuffer The hash to sign
 * @returns The signature as an ArrayBuffer
 */
export async function signInvoiceHash(privateKey: CryptoKey, hashBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.sign(
    {
      name: 'RSASSA-PKCS1-v1_5',
    },
    privateKey,
    hashBuffer
  );
}

/**
 * Verify a digital signature against a hash
 * @param publicKey The public key to verify with
 * @param signature The signature to verify
 * @param hashBuffer The original hash
 * @returns True if the signature is valid
 */
export async function verifySignature(
  publicKey: CryptoKey,
  signature: ArrayBuffer,
  hashBuffer: ArrayBuffer
): Promise<boolean> {
  try {
    return await crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      publicKey,
      signature,
      hashBuffer
    );
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

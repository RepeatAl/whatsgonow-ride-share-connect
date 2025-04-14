
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";

/**
 * Generate an asymmetric key pair for document signing
 * @returns A CryptoKeyPair with public and private keys
 */
export async function generateSignatureKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify']
  );
}

/**
 * Create a SHA-256 hash of data
 * @param data The data to hash
 * @returns The hash as an ArrayBuffer
 */
export async function createSHA256Hash(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', data);
}

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
 * Export a public key in PEM format for storage
 * @param publicKey The public key to export
 * @returns The public key in PEM format
 */
export async function exportPublicKeyPEM(publicKey: CryptoKey): Promise<string> {
  const spki = await crypto.subtle.exportKey('spki', publicKey);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
  return `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
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

/**
 * Import a public key from PEM format
 * @param pemKey The public key in PEM format
 * @returns The public key as a CryptoKey
 */
export async function importPublicKeyFromPEM(pemKey: string): Promise<CryptoKey | null> {
  try {
    // Remove header, footer, newlines
    const pemContents = pemKey
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\n/g, '');
    
    // Convert base64 to ArrayBuffer
    const binaryString = atob(pemContents);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Import the key
    return await crypto.subtle.importKey(
      'spki',
      bytes.buffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' },
      },
      true,
      ['verify']
    );
  } catch (error) {
    console.error("Error importing public key:", error);
    return null;
  }
}

/**
 * Sign an invoice document and store the signature
 * @param invoiceId The ID of the invoice to sign
 * @param fileBuffer The file content
 */
export async function signAndStoreInvoice(
  invoiceId: string,
  fileBuffer: ArrayBuffer
): Promise<boolean> {
  try {
    // Generate a new key pair
    const keyPair = await generateSignatureKeyPair();
    
    // Create hash of the document
    const hashBuffer = await createSHA256Hash(fileBuffer);
    
    // Sign the hash
    const signature = await signInvoiceHash(keyPair.privateKey, hashBuffer);
    
    // Export public key for storage
    const publicKeyPEM = await exportPublicKeyPEM(keyPair.publicKey);
    
    // Convert signature to base64 for storage
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    // Store signature and public key in database
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
    console.error("Error signing invoice:", error);
    toast({
      title: "Signierungsfehler",
      description: "Die Rechnung konnte nicht digital signiert werden.",
      variant: "destructive"
    });
    return false;
  }
}

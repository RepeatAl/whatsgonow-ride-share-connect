
import { supabase } from '@/lib/supabaseClient';

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
 * Import a public key from PEM format
 * @param pemKey The public key in PEM format
 * @returns The public key as a CryptoKey
 */
export async function importPublicKeyFromPEM(pemKey: string): Promise<CryptoKey | null> {
  try {
    // Remove header, footer, newlines using regex for better reliability
    const pemContents = pemKey.replace(/(-----(BEGIN|END) PUBLIC KEY-----|\n)/g, '');
    
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

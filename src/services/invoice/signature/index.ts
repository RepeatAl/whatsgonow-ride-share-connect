
import { generateSignatureKeyPair, exportPublicKeyPEM, importPublicKeyFromPEM } from './keyManagement';
import { createSHA256Hash, textToArrayBuffer } from './hashingService';
import { signInvoiceHash, verifySignature } from './signatureOperations';
import { storeSignatureInDatabase } from './storageService';
import { toast } from "@/hooks/use-toast";

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
    return await storeSignatureInDatabase(invoiceId, signatureBase64, publicKeyPEM);
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

/**
 * Sign an invoice using text content
 * Alternative signature method that accepts plain text instead of ArrayBuffer
 * @param invoiceText The text content of the invoice
 * @param invoiceId The invoice ID
 * @returns Success status
 */
export async function signAndStoreInvoiceText(
  invoiceText: string, 
  invoiceId: string
): Promise<boolean> {
  try {
    // Convert text to ArrayBuffer
    const dataBuffer = textToArrayBuffer(invoiceText);
    
    // Use the main signature function with the converted buffer
    return await signAndStoreInvoice(invoiceId, dataBuffer);
  } catch (error) {
    console.error("Error signing invoice text:", error);
    toast({
      title: "Signierungsfehler",
      description: "Die Rechnung konnte nicht digital signiert werden.",
      variant: "destructive"
    });
    return false;
  }
}

/**
 * Verify invoice signature using text content and signature data
 * @param params Object containing invoice text, signature (base64), and public key (PEM)
 * @returns True if the signature is valid
 */
export async function verifyInvoiceSignature({
  invoiceText,
  signatureBase64,
  publicKeyPEM
}: {
  invoiceText: string;
  signatureBase64: string;
  publicKeyPEM: string;
}): Promise<boolean> {
  try {
    // Convert text to hash
    const dataBuffer = textToArrayBuffer(invoiceText);
    const hash = await createSHA256Hash(dataBuffer);
    
    // Convert base64 signature to ArrayBuffer
    const signatureBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));
    
    // Import the public key
    const publicKey = await importPublicKeyFromPEM(publicKeyPEM);
    if (!publicKey) return false;
    
    // Verify the signature
    return await verifySignature(
      publicKey,
      signatureBytes,
      hash
    );
  } catch (error) {
    console.error("Error verifying invoice signature:", error);
    return false;
  }
}

export {
  generateSignatureKeyPair,
  exportPublicKeyPEM,
  importPublicKeyFromPEM,
  createSHA256Hash,
  textToArrayBuffer,
  signInvoiceHash,
  verifySignature,
  storeSignatureInDatabase
};

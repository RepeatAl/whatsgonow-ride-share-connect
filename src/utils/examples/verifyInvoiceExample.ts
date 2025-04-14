
import { invoiceService } from "@/services/invoice";

/**
 * Example of how to verify an invoice signature
 * @param invoiceContent The original text content of the invoice
 * @param signatureBase64 The base64-encoded signature
 * @param publicKeyPEM The public key in PEM format
 */
export async function verifyInvoiceExample(
  invoiceContent: string,
  signatureBase64: string,
  publicKeyPEM: string
): Promise<boolean> {
  try {
    return await invoiceService.verifyInvoiceSignature({
      invoiceText: invoiceContent,
      signatureBase64,
      publicKeyPEM
    });
  } catch (error) {
    console.error("Error in verify invoice example:", error);
    return false;
  }
}

/**
 * Example of a complete verification process
 */
export async function completeVerificationExample(invoiceId: string): Promise<void> {
  // In a real application, you would fetch these values from your database
  // This is just a simplified example
  const invoiceData = await fetchInvoiceData(invoiceId);
  
  if (!invoiceData || !invoiceData.digital_signature) {
    console.error("Invoice not found or not signed");
    return;
  }
  
  const success = await verifyInvoiceExample(
    invoiceData.content,
    invoiceData.digital_signature.signature,
    invoiceData.digital_signature.publicKey
  );
  
  if (success) {
    console.log("Invoice signature verified successfully!");
  } else {
    console.error("Failed to verify invoice signature");
  }
}

// Mock function to simulate fetching invoice data
// In a real app, this would query your database
async function fetchInvoiceData(invoiceId: string) {
  // This would be a Supabase query in a real application
  console.log(`Fetching invoice data for ID: ${invoiceId}`);
  
  // Mock data for example purposes
  return {
    invoice_id: invoiceId,
    content: "Test-Invoice-Content für Rechnung #123",
    digital_signature: {
      signature: "base64-encoded-signature-here",
      publicKey: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----",
      algorithm: "RSASSA-PKCS1-v1_5",
      hashAlgorithm: "SHA-256",
      created: new Date().toISOString()
    }
  };
}

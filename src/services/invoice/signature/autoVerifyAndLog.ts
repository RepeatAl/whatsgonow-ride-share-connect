
import { verifyInvoiceSignature } from './index';
import { insertValidationResult } from '../validation/validationLogService';

/**
 * Automatically verify a digital signature and log the result
 * @param invoiceId The invoice ID
 * @param invoiceText The original text content of the invoice
 * @param signature The signature in base64 format
 * @param publicKeyPEM The public key in PEM format
 * @returns Whether the signature is valid
 */
export async function autoVerifyAndLog(
  invoiceId: string, 
  invoiceText: string, 
  signature: string,
  publicKeyPEM: string
): Promise<boolean> {
  try {
    // Verify the signature
    const passed = await verifyInvoiceSignature({
      invoiceText,
      signatureBase64: signature,
      publicKeyPEM
    });

    // Log the validation result
    await insertValidationResult({
      invoice_id: invoiceId,
      validation_type: 'digital_signature',
      passed,
      validator_version: '1.0.0',
      error_messages: passed ? [] : ['Signature mismatch or tampering detected'],
      warning_messages: []
    });

    return passed;
  } catch (error) {
    console.error("Error in automatic signature verification:", error);
    
    // Log the error
    await insertValidationResult({
      invoice_id: invoiceId,
      validation_type: 'digital_signature',
      passed: false,
      validator_version: '1.0.0',
      error_messages: [`Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warning_messages: []
    });
    
    return false;
  }
}

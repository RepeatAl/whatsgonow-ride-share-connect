
/**
 * @deprecated Use the modular signature services from './signature' instead
 * This file is kept for backward compatibility
 */

import {
  generateSignatureKeyPair,
  exportPublicKeyPEM,
  importPublicKeyFromPEM,
  createSHA256Hash,
  signInvoiceHash,
  verifySignature,
  signAndStoreInvoice,
  signAndStoreInvoiceText,
  verifyInvoiceSignature
} from './signature';

// Re-export all functions for backward compatibility
export {
  generateSignatureKeyPair,
  createSHA256Hash,
  signInvoiceHash,
  exportPublicKeyPEM,
  importPublicKeyFromPEM,
  verifySignature,
  verifyInvoiceSignature,
  signAndStoreInvoice,
  signAndStoreInvoiceText
};

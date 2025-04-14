
/**
 * Main invoice service that aggregates all functionality
 */
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { storageService } from './storage';
import { emailService } from './emailService';
import { autoInvoiceService } from './autoInvoiceService';
import { detailedInvoiceService } from './detailedInvoiceService';
import { validationService } from './validationService';
import { archiveService } from './archiveService';
import * as signatureService from './signature';

export const invoiceService = {
  // PDF operations
  generatePDF: pdfService.generatePDF,
  downloadPDFInvoice: pdfService.downloadPDFInvoice,
  
  // XML operations
  generateXML: xmlService.generateXML,
  downloadXMLInvoice: xmlService.downloadXMLInvoice,
  
  // Storage operations
  storeInvoice: storageService.storeInvoice,
  getInvoiceById: storageService.getInvoiceById,
  
  // Email operations
  sendInvoiceEmail: emailService.sendInvoiceEmail,
  
  // Auto-invoice operations
  handleAutoInvoice: autoInvoiceService.handleAutoInvoice,
  
  // Detailed invoice operations
  createDetailedInvoice: detailedInvoiceService.createDetailedInvoice,
  getDetailedInvoice: detailedInvoiceService.getDetailedInvoice,
  
  // Validation operations
  validateInvoice: validationService.validateInvoice,
  validateInvoiceAll: validationService.validateInvoiceAll,
  getValidationResults: validationService.getValidationResults,
  isInvoiceValid: validationService.isInvoiceValid,
  
  // Archive operations
  archiveInvoice: archiveService.archiveInvoice,
  verifyArchiveIntegrity: archiveService.verifyArchiveIntegrity,
  getArchiveInfo: archiveService.getArchiveInfo,
  
  // Digital signature operations
  signInvoice: signatureService.signAndStoreInvoice,
  signInvoiceText: signatureService.signAndStoreInvoiceText,
  verifySignature: signatureService.verifySignature,
  verifyInvoiceSignature: signatureService.verifyInvoiceSignature,
  autoVerifyAndLog: signatureService.autoVerifyAndLog
};

export * from './pdfService';
export * from './xmlService';
export * from './storage';
export * from './emailService';
export * from './autoInvoiceService';
export * from './detailedInvoiceService';
export * from './validationService';
export * from './archiveService';
export * from './signature';
export * from './archiveSignatureService'; // For backward compatibility

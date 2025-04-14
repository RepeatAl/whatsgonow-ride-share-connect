
/**
 * Main invoice service that aggregates all functionality
 */
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { storageService } from './storageService';
import { emailService } from './emailService';
import { autoInvoiceService } from './autoInvoiceService';
import { detailedInvoiceService } from './detailedInvoiceService';
import { validationService } from './validationService';

export const invoiceService = {
  // PDF operations
  generatePDF: pdfService.generatePDF,
  downloadPDFInvoice: pdfService.downloadPDFInvoice,
  
  // XML operations
  generateXML: xmlService.generateXML,
  downloadXMLInvoice: xmlService.downloadXMLInvoice,
  
  // Storage operations
  storeInvoice: storageService.storeInvoice,
  
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
  isInvoiceValid: validationService.isInvoiceValid
};

export * from './pdfService';
export * from './xmlService';
export * from './storageService';
export * from './emailService';
export * from './autoInvoiceService';
export * from './detailedInvoiceService';
export * from './validationService';

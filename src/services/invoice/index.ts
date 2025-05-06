
/**
 * Haupt-Invoice-Service, der alle Funktionen zusammenfasst
 */
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { storageService } from './storage';
import { emailService } from './emailService';
import { xRechnungService } from './xRechnungService';
import { autoInvoiceService } from './autoInvoiceService';
import { detailedInvoiceService } from './detailedInvoiceService';
import { validationService } from './validationService';
import { archiveService } from './archiveService';
import * as signatureService from './signature';

export const invoiceService = {
  // PDF-Operationen
  generatePDF: pdfService.generatePDF,
  downloadPDFInvoice: pdfService.downloadPDFInvoice,
  
  // XML-Operationen
  generateXML: xmlService.generateXML,
  downloadXMLInvoice: xmlService.downloadXMLInvoice,
  
  // Storage-Operationen
  storeInvoice: storageService.storeInvoice,
  getInvoiceById: storageService.getInvoiceById,
  
  // E-Mail-Operationen
  sendInvoiceEmail: emailService.sendInvoiceEmail,
  
  // XRechnung-Operationen für Behörden
  sendXRechnungEmail: xRechnungService.sendXRechnungEmail,
  sendXRechnungPreview: xRechnungService.sendXRechnungPreview,
  isGovernmentAgency: xRechnungService.isGovernmentAgency,
  autoSendXRechnungIfGovernment: xRechnungService.autoSendXRechnungIfGovernment,
  
  // Auto-Invoice-Operationen
  handleAutoInvoice: autoInvoiceService.handleAutoInvoice,
  
  // Detaillierte Rechnungs-Operationen
  createDetailedInvoice: detailedInvoiceService.createDetailedInvoice,
  getDetailedInvoice: detailedInvoiceService.getDetailedInvoice,
  
  // Validierungs-Operationen
  validateInvoice: validationService.validateInvoice,
  validateInvoiceAll: validationService.validateInvoiceAll,
  getValidationResults: validationService.getValidationResults,
  isInvoiceValid: validationService.isInvoiceValid,
  
  // Archivierungs-Operationen
  archiveInvoice: archiveService.archiveInvoice,
  verifyArchiveIntegrity: archiveService.verifyArchiveIntegrity,
  getArchiveInfo: archiveService.getArchiveInfo,
  
  // Digitale Signatur-Operationen
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
export * from './xRechnungService';
export * from './autoInvoiceService';
export * from './detailedInvoiceService';
export * from './validationService';
export * from './archiveService';
export * from './signature';
export * from './archiveSignatureService'; // Für Abwärtskompatibilität

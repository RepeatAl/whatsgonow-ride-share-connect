
/**
 * Main invoice service that aggregates all functionality
 */
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { storageService } from './storageService';
import { emailService } from './emailService';
import { autoInvoiceService } from './autoInvoiceService';

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
  handleAutoInvoice: autoInvoiceService.handleAutoInvoice
};

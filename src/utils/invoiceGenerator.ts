
/**
 * @deprecated This file is kept for backward compatibility
 * Please import from src/utils/invoice/ instead
 */

import { 
  InvoiceData, 
  InvoiceItem,
  generateInvoiceNumber,
  calculateDueDate,
  formatCurrency,
  getServiceDescription,
  generateXRechnungXML,
  stringToBlob,
  prepareInvoiceData
} from './invoice';

// Re-export for backward compatibility
export type { InvoiceData, InvoiceItem };
export { 
  generateInvoiceNumber,
  calculateDueDate,
  formatCurrency,
  getServiceDescription,
  generateXRechnungXML,
  stringToBlob,
  prepareInvoiceData
};

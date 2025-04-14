
import { TaxIdentification, TaxIdType } from './invoiceTypes';

/**
 * Validates a German tax ID (USt-ID or Steuernummer)
 * @param taxId The tax ID to validate
 * @returns An object with the tax ID type, value, and validation status
 */
export const validateTaxId = (taxId: string): TaxIdentification => {
  // Normalize the tax ID by removing spaces and hyphens
  const normalizedTaxId = taxId.replace(/[\s-]/g, '');
  
  // Detect the type of tax ID
  if (normalizedTaxId.startsWith('DE') && normalizedTaxId.length === 11) {
    // This is a German USt-ID (VAT ID)
    // Format: DE + 9 digits
    const isValid = /^DE\d{9}$/.test(normalizedTaxId);
    
    return {
      type: 'ustid',
      value: normalizedTaxId,
      isValid
    };
  } else {
    // Try to validate as a German Steuernummer
    // Format: 123/456/78901 (13 digits with separators)
    // or 1234567890 (10-11 digits without separators)
    const isValidFormat1 = /^\d{3}\/\d{3}\/\d{5}$/.test(taxId);
    const isValidFormat2 = /^\d{10,11}$/.test(normalizedTaxId);
    
    return {
      type: 'steuernummer',
      value: taxId, // Keep original format for display
      isValid: isValidFormat1 || isValidFormat2
    };
  }
};

/**
 * Formats a tax ID for display
 * @param taxId The tax identification object
 * @returns Formatted tax ID string for display
 */
export const formatTaxIdForDisplay = (taxId: TaxIdentification): string => {
  if (taxId.type === 'ustid') {
    return `USt-ID: ${taxId.value}`;
  } else {
    return `Steuernummer: ${taxId.value}`;
  }
};

/**
 * Formats a tax ID for XML
 * @param taxId The tax identification object
 * @returns Formatted tax ID string for XML
 */
export const formatTaxIdForXML = (taxId: TaxIdentification): string => {
  return taxId.value.replace(/[\/\s-]/g, '');
};

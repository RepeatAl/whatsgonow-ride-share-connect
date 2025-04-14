import { validateInvoice, getValidationResults, ValidatorType, ValidationResult } from '@/utils/invoice/validation';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { getAllValidationResults, getInvoiceAuditLog } from './validation/validationLogService';

/**
 * Service for handling invoice validation operations
 */
export const validationService = {
  /**
   * Validate an invoice
   */
  validateInvoice: async (invoiceId: string, validationType: ValidatorType = 'xrechnung'): Promise<ValidationResult> => {
    try {
      return await validateInvoice(invoiceId, validationType);
    } catch (error) {
      console.error("Error validating invoice:", error);
      toast({
        title: "Validierungsfehler",
        description: "Die Rechnung konnte nicht validiert werden.",
        variant: "destructive"
      });
      
      return {
        passed: false,
        validationType,
        errorMessages: ["Validierungsfehler: Die Rechnung konnte nicht validiert werden."]
      };
    }
  },

  /**
   * Run multiple validations on an invoice
   */
  validateInvoiceAll: async (invoiceId: string): Promise<{[key in ValidatorType]?: ValidationResult}> => {
    try {
      const types: ValidatorType[] = ['xrechnung', 'gobd', 'format', 'tax'];
      const results: {[key in ValidatorType]?: ValidationResult} = {};
      
      for (const type of types) {
        results[type] = await validateInvoice(invoiceId, type);
      }
      
      // Update invoice status based on validation results
      const allPassed = Object.values(results).every(result => result.passed);
      
      if (allPassed) {
        await supabase
          .from('invoices')
          .update({ 
            xrechnung_compliant: true,
            gobd_compliant: true,
            status: 'validated'
          })
          .eq('invoice_id', invoiceId);
      }
      
      return results;
    } catch (error) {
      console.error("Error running all validations:", error);
      toast({
        title: "Validierungsfehler",
        description: "Die Validierung der Rechnung ist fehlgeschlagen.",
        variant: "destructive"
      });
      
      return {};
    }
  },

  /**
   * Get validation results for an invoice
   */
  getValidationResults: async (invoiceId: string): Promise<ValidationResult[]> => {
    try {
      return await getValidationResults(invoiceId);
    } catch (error) {
      console.error("Error fetching validation results:", error);
      return [];
    }
  },
  
  /**
   * Check if an invoice is valid
   */
  isInvoiceValid: async (invoiceId: string): Promise<boolean> => {
    try {
      const results = await getValidationResults(invoiceId);
      return results.length > 0 && results.every(result => result.passed);
    } catch (error) {
      console.error("Error checking invoice validity:", error);
      return false;
    }
  },

  /**
   * Get all validation results with optional filters
   */
  getAllValidationResults: async (filters = {}) => {
    return getAllValidationResults(filters);
  },

  /**
   * Get audit log entries for a specific invoice
   */
  getInvoiceAuditLog: async (invoiceId: string) => {
    return getInvoiceAuditLog(invoiceId);
  }
};


import { supabase } from '@/lib/supabaseClient';

/**
 * Validator types supported by the system
 */
export type ValidatorType = 'xrechnung' | 'gobd' | 'format' | 'tax';

/**
 * Validation result interface
 */
export interface ValidationResult {
  passed: boolean;
  validationType: ValidatorType;
  warningMessages?: string[];
  errorMessages?: string[];
}

/**
 * Run validation on an invoice
 * @param invoiceId The ID of the invoice to validate
 * @param validationType The type of validation to run
 */
export const validateInvoice = async (
  invoiceId: string, 
  validationType: ValidatorType = 'xrechnung'
): Promise<ValidationResult> => {
  try {
    // In a real implementation, this would call the actual validation logic
    // For now, we'll use mock validation that always passes
    const mockValidation: ValidationResult = {
      passed: true,
      validationType,
      warningMessages: [],
      errorMessages: []
    };
    
    // Store validation result in the database
    await storeValidationResult(invoiceId, mockValidation);
    
    return mockValidation;
  } catch (error) {
    console.error("Error validating invoice:", error);
    const failedValidation: ValidationResult = {
      passed: false,
      validationType,
      errorMessages: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
    
    // Store failed validation result
    await storeValidationResult(invoiceId, failedValidation);
    
    return failedValidation;
  }
};

/**
 * Store validation result in the database
 */
export const storeValidationResult = async (
  invoiceId: string, 
  result: ValidationResult
): Promise<void> => {
  try {
    await supabase.from("invoice_validation_results").insert({
      invoice_id: invoiceId,
      validation_type: result.validationType,
      passed: result.passed,
      validator_version: "1.0.0", // This would be dynamically determined in a real implementation
      warning_messages: result.warningMessages || [],
      error_messages: result.errorMessages || []
    });
  } catch (error) {
    console.error("Error storing validation result:", error);
    // We don't throw here to avoid interrupting the invoice process
  }
};

/**
 * Get all validation results for an invoice
 */
export const getValidationResults = async (invoiceId: string): Promise<ValidationResult[]> => {
  try {
    const { data, error } = await supabase
      .from("invoice_validation_results")
      .select("*")
      .eq("invoice_id", invoiceId);
      
    if (error) throw error;
    
    return (data || []).map(item => ({
      passed: item.passed,
      validationType: item.validation_type as ValidatorType,
      warningMessages: item.warning_messages as string[],
      errorMessages: item.error_messages as string[]
    }));
  } catch (error) {
    console.error("Error fetching validation results:", error);
    return [];
  }
};

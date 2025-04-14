
import { supabase } from '@/lib/supabaseClient';

/**
 * Store validation result in the database
 * @param params Object containing validation details
 * @returns Promise with the database operation result
 */
export async function insertValidationResult({
  invoice_id,
  validation_type,
  passed,
  validator_version,
  error_messages,
  warning_messages,
}: {
  invoice_id: string;
  validation_type: string;
  passed: boolean;
  validator_version: string;
  error_messages: string[];
  warning_messages: string[];
}) {
  try {
    const { data, error } = await supabase.from('invoice_validation_results').insert({
      invoice_id,
      validation_type,
      passed,
      validator_version,
      error_messages,
      warning_messages,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error storing validation result:", error);
    return { data: null, error };
  }
}

/**
 * Retrieve all validation results for a specific invoice
 * @param invoiceId The ID of the invoice
 * @returns Array of validation results
 */
export async function getValidationResults(invoiceId: string) {
  try {
    const { data, error } = await supabase
      .from('invoice_validation_results')
      .select('*')
      .eq('invoice_id', invoiceId);
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching validation results:", error);
    return { data: null, error };
  }
}


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

/**
 * Get all validation results with optional filters
 * @param filters Optional filtering parameters
 * @returns Array of validation results
 */
export async function getAllValidationResults({
  validationType,
  passed,
  startDate,
  endDate,
  invoiceId,
}: {
  validationType?: string;
  passed?: boolean;
  startDate?: string;
  endDate?: string;
  invoiceId?: string;
} = {}) {
  try {
    let query = supabase
      .from('invoice_validation_results')
      .select('*');
    
    // Apply filters if provided
    if (validationType) {
      query = query.eq('validation_type', validationType);
    }
    
    if (passed !== undefined) {
      query = query.eq('passed', passed);
    }
    
    if (startDate) {
      query = query.gte('validation_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('validation_date', endDate);
    }
    
    if (invoiceId) {
      query = query.ilike('invoice_id', `%${invoiceId}%`);
    }
    
    // Execute the query
    const { data, error } = await query.order('validation_date', { ascending: false });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching all validation results:", error);
    return { data: null, error };
  }
}

/**
 * Get audit log entries for a specific invoice
 * @param invoiceId The ID of the invoice
 * @returns Array of audit log entries
 */
export async function getInvoiceAuditLog(invoiceId: string) {
  try {
    const { data, error } = await supabase
      .from('invoice_audit_log')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching invoice audit log:", error);
    return { data: null, error };
  }
}

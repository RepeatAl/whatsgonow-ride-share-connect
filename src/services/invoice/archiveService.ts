
import { supabase } from '@/lib/supabaseClient';
import { add } from 'date-fns';
import { toast } from "@/hooks/use-toast";

/**
 * Creates a SHA-256 hash using the Web Crypto API (browser compatible)
 * @param buffer The buffer to hash
 * @returns The hex-encoded hash string
 */
async function createSHA256Hash(buffer: ArrayBuffer): Promise<string> {
  // Use the Web Crypto API instead of Node.js crypto module
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  
  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Service for handling invoice archiving operations in compliance with GoBD standards
 */
export const archiveService = {
  /**
   * Archive an invoice with compliance metadata
   * 
   * @param invoiceId The ID of the invoice to archive
   * @param fileBuffer The file content to hash for immutability verification
   * @param retentionYears Optional number of years to retain the document (default: 10)
   */
  archiveInvoice: async (
    invoiceId: string, 
    fileBuffer: ArrayBuffer,
    retentionYears: number = 10
  ): Promise<boolean> => {
    try {
      // Create document hash for immutability verification
      const documentHash = await createSHA256Hash(fileBuffer);
      
      // Calculate scheduled deletion date based on retention period
      const scheduledDeletionDate = add(new Date(), { years: retentionYears });
      
      // Update invoice with archival information
      const { error } = await supabase
        .from("invoices")
        .update({
          document_hash: documentHash,
          gobd_compliant: true,
          retention_period: `${retentionYears} years`,
          scheduled_deletion_date: scheduledDeletionDate.toISOString(),
          status: 'archived',
          updated_at: new Date().toISOString()
        })
        .eq("invoice_id", invoiceId);
        
      if (error) throw error;
      
      // Log the archiving operation
      await supabase.from("invoice_audit_log").insert({
        invoice_id: invoiceId,
        action: "archive",
        new_state: {
          document_hash: documentHash,
          retention_period: `${retentionYears} years`,
          scheduled_deletion_date: scheduledDeletionDate.toISOString()
        }
      });
      
      console.log(`Invoice ${invoiceId} archived successfully with ${retentionYears} year retention`);
      return true;
    } catch (error) {
      console.error("Error archiving invoice:", error);
      toast({
        title: "Archivierungsfehler",
        description: "Die Rechnung konnte nicht archiviert werden.",
        variant: "destructive"
      });
      return false;
    }
  },
  
  /**
   * Verify if an invoice archive is intact by comparing hashes
   * 
   * @param invoiceId The ID of the invoice to verify
   * @param fileBuffer Current file content to verify against stored hash
   */
  verifyArchiveIntegrity: async (
    invoiceId: string,
    fileBuffer: ArrayBuffer
  ): Promise<{ intact: boolean; message: string }> => {
    try {
      // Get the stored hash from the database
      const { data, error } = await supabase
        .from("invoices")
        .select("document_hash")
        .eq("invoice_id", invoiceId)
        .single();
        
      if (error) throw error;
      if (!data || !data.document_hash) {
        return { 
          intact: false, 
          message: "Diese Rechnung wurde nicht archiviert oder hat keinen gespeicherten Hash."
        };
      }
      
      // Calculate current hash of the file
      const currentHash = await createSHA256Hash(fileBuffer);
      
      // Compare stored hash with current hash
      const intact = data.document_hash === currentHash;
      
      return {
        intact,
        message: intact 
          ? "Archivintegrität bestätigt. Die Rechnung wurde nicht verändert."
          : "Integritätsfehler! Die Rechnung wurde möglicherweise verändert."
      };
    } catch (error) {
      console.error("Error verifying archive integrity:", error);
      return {
        intact: false,
        message: "Fehler bei der Überprüfung der Archivintegrität."
      };
    }
  },
  
  /**
   * Get archival information for an invoice
   */
  getArchiveInfo: async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          document_hash,
          gobd_compliant,
          retention_period,
          scheduled_deletion_date,
          retention_legal_basis
        `)
        .eq("invoice_id", invoiceId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error fetching archive info:", error);
      return null;
    }
  }
};

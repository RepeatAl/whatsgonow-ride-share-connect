
import { supabase } from '@/lib/supabaseClient';
import { createHash } from 'crypto';
import dayjs from 'date-fns';
import { toast } from "@/hooks/use-toast";

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
    fileBuffer: Buffer,
    retentionYears: number = 10
  ): Promise<boolean> => {
    try {
      // Create document hash for immutability verification
      const documentHash = createHash("sha256").update(fileBuffer).digest("hex");
      
      // Calculate scheduled deletion date based on retention period
      const scheduledDeletionDate = new Date();
      scheduledDeletionDate.setFullYear(scheduledDeletionDate.getFullYear() + retentionYears);
      
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
    fileBuffer: Buffer
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
      const currentHash = createHash("sha256").update(fileBuffer).digest("hex");
      
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

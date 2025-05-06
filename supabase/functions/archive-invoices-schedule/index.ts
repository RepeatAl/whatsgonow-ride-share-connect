
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Environment configuration
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Scheduled execution configuration
export const config = { schedule: "0 2 * * *" }; // Run daily at 2 AM

// Create Supabase client with service role privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// CORS headers for API responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Creates a SHA-256 hash of a buffer
 * @param buffer The data to hash
 * @returns A hex string of the hash
 */
async function createSHA256Hash(buffer: ArrayBuffer): Promise<string> {
  // Use the Web Crypto API for hashing
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
  return hashHex;
}

/**
 * Downloads a file from Supabase Storage
 * @param bucket The bucket name
 * @param path The file path
 * @returns The file data as ArrayBuffer or null if failed
 */
async function downloadFileFromStorage(bucket: string, path: string): Promise<ArrayBuffer | null> {
  try {
    // Get the file download URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
      
    if (error || !data) {
      console.error(`Error downloading file from ${bucket}/${path}:`, error);
      return null;
    }
    
    return await data.arrayBuffer();
  } catch (error) {
    console.error(`Exception downloading file from ${bucket}/${path}:`, error);
    return null;
  }
}

/**
 * Archives a single invoice
 * @param invoice The invoice data to archive
 * @returns Result object with status and messages
 */
async function archiveInvoice(invoice: any): Promise<{ 
  success: boolean; 
  invoice_id: string; 
  message: string;
  hash?: string;
}> {
  try {
    const { invoice_id, pdf_url } = invoice;
    
    // Skip if no PDF URL is available
    if (!pdf_url) {
      return {
        success: false,
        invoice_id,
        message: "No PDF URL available"
      };
    }
    
    // Extract path from the PDF URL
    // Assuming URL format: https://[project-ref].supabase.co/storage/v1/object/public/invoices/[path]
    const pathMatch = pdf_url.match(/\/object\/public\/invoices\/(.+)$/);
    if (!pathMatch || !pathMatch[1]) {
      return {
        success: false,
        invoice_id,
        message: "Could not extract path from PDF URL"
      };
    }
    
    const pdfPath = decodeURIComponent(pathMatch[1]);
    
    // Download the PDF file
    const pdfBuffer = await downloadFileFromStorage("invoices", pdfPath);
    if (!pdfBuffer) {
      return {
        success: false,
        invoice_id,
        message: "Failed to download PDF file"
      };
    }
    
    // Create hash of the PDF content
    const documentHash = await createSHA256Hash(pdfBuffer);
    
    // Check if the hash is already stored and matches
    if (invoice.document_hash) {
      const hashMatches = invoice.document_hash === documentHash;
      
      if (hashMatches) {
        return {
          success: true,
          invoice_id,
          message: "Document hash verified, no changes needed",
          hash: documentHash
        };
      } else {
        // Hash mismatch - potential document tampering
        await supabase
          .from("invoices")
          .update({
            gobd_compliance_failed: true,
            updated_at: new Date().toISOString()
          })
          .eq("invoice_id", invoice_id);
          
        return {
          success: false,
          invoice_id,
          message: "Hash mismatch detected! Document may have been tampered with.",
          hash: documentHash
        };
      }
    }
    
    // Calculate retention period (10 years by default)
    const retentionYears = 10;
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setFullYear(scheduledDeletionDate.getFullYear() + retentionYears);
    
    // Update the invoice with the hash and GoBD compliance status
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        document_hash: documentHash,
        gobd_compliant: true,
        retention_period: `${retentionYears} years`,
        retention_started_at: new Date().toISOString(),
        scheduled_deletion_date: scheduledDeletionDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("invoice_id", invoice_id);
      
    if (updateError) {
      console.error(`Error updating invoice ${invoice_id}:`, updateError);
      return {
        success: false,
        invoice_id,
        message: `Database update failed: ${updateError.message}`,
        hash: documentHash
      };
    }
    
    // Create audit log entry
    const { error: auditError } = await supabase
      .from("invoice_audit_log")
      .insert({
        invoice_id,
        action: "archived",
        new_state: {
          document_hash: documentHash,
          gobd_compliant: true,
          retention_period: `${retentionYears} years`,
          scheduled_deletion_date: scheduledDeletionDate.toISOString()
        },
        user_id: null, // System action
        timestamp: new Date().toISOString()
      });
      
    if (auditError) {
      console.error(`Error creating audit log for invoice ${invoice_id}:`, auditError);
    }
    
    return {
      success: true,
      invoice_id,
      message: "Successfully archived invoice for GoBD compliance",
      hash: documentHash
    };
  } catch (error) {
    console.error(`Exception processing invoice ${invoice.invoice_id}:`, error);
    return {
      success: false,
      invoice_id: invoice.invoice_id,
      message: `Exception: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Main function to process all eligible invoices for archiving
 */
async function processInvoicesForArchiving(): Promise<{
  total: number;
  succeeded: number;
  failed: number;
  results: Array<{ invoice_id: string; success: boolean; message: string; }>;
}> {
  try {
    // Get all invoices that need archiving
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("status", "sent")
      .eq("gobd_compliant", false);
      
    if (error) {
      console.error("Error fetching invoices:", error);
      return { total: 0, succeeded: 0, failed: 0, results: [] };
    }
    
    console.log(`Found ${invoices.length} invoices to process for GoBD archiving`);
    
    const results = [];
    let succeeded = 0;
    let failed = 0;
    
    // Process each invoice
    for (const invoice of invoices) {
      const result = await archiveInvoice(invoice);
      results.push({
        invoice_id: result.invoice_id,
        success: result.success,
        message: result.message
      });
      
      if (result.success) {
        succeeded++;
      } else {
        failed++;
      }
    }
    
    console.log(`Archiving complete. Succeeded: ${succeeded}, Failed: ${failed}`);
    
    // Return summary of results
    return {
      total: invoices.length,
      succeeded,
      failed,
      results
    };
  } catch (error) {
    console.error("Error in processInvoicesForArchiving:", error);
    return { 
      total: 0, 
      succeeded: 0, 
      failed: 1, 
      results: [{ 
        invoice_id: "process", 
        success: false, 
        message: `Process error: ${error instanceof Error ? error.message : String(error)}` 
      }] 
    };
  }
}

// Handler for the edge function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Check for manual test route
    if (url.pathname.endsWith("/test-archive-run")) {
      // Additional verification could be added here in production
      console.log("Manual test run initiated");
      const results = await processInvoicesForArchiving();
      
      return new Response(JSON.stringify(results), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    
    // Handle scheduled invocation
    if (req.method === "POST") {
      // This branch handles automated scheduled runs
      console.log("Scheduled archive run started");
      const results = await processInvoicesForArchiving();
      
      return new Response(JSON.stringify(results), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    
    // Default response for GET requests
    return new Response(JSON.stringify({
      message: "Invoice archiving function is active. Use POST for execution or /test-archive-run for testing.",
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error in handler:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});

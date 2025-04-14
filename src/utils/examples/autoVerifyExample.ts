
import { invoiceService } from "@/services/invoice";

/**
 * Example showing how to use the automatic signature verification and logging
 * @param invoiceId The ID of the invoice to verify
 */
export async function autoVerifyExample(invoiceId: string): Promise<boolean> {
  try {
    // In a real application, you would fetch these values from your database
    const invoice = await invoiceService.getInvoiceById(invoiceId);
    
    if (!invoice || !invoice.digital_signature) {
      console.error("Invoice not found or not signed");
      return false;
    }
    
    // Generate sample invoice content - in a real app this would be reconstructed
    // from the invoice data or retrieved from a database
    const invoiceContent = `Rechnung für Auftrag #${invoice.order_id} - ${new Date(invoice.created_at).toLocaleDateString('de-DE')}`;
    
    // Run the automatic verification and logging
    return await invoiceService.autoVerifyAndLog(
      invoiceId,
      invoiceContent,
      invoice.digital_signature.signature,
      invoice.digital_signature.publicKey
    );
  } catch (error) {
    console.error("Error in auto-verify example:", error);
    return false;
  }
}

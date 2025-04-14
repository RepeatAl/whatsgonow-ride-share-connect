
import { invoiceService } from "@/services/invoice";

/**
 * Example of how to sign an invoice using text content
 * @param invoiceContent The text content to sign
 * @param invoiceId The ID of the invoice to sign
 */
export async function signInvoiceExample(invoiceContent: string, invoiceId: string): Promise<boolean> {
  try {
    // The correct way to call the function - invoiceText first, then invoiceId
    return await invoiceService.signInvoiceText(invoiceContent, invoiceId);
  } catch (error) {
    console.error("Error in sign invoice example:", error);
    return false;
  }
}

/**
 * Example of a complete signing process
 */
export async function completeSigningExample(): Promise<void> {
  // Example invoice content and ID
  const invoiceContent = "Test-Invoice-Content für Rechnung #123";
  const invoiceId = "your-invoice-id-here";
  
  // Sign the invoice with text content
  const success = await signInvoiceExample(invoiceContent, invoiceId);
  
  if (success) {
    console.log("Invoice signed successfully!");
  } else {
    console.error("Failed to sign invoice");
  }
}

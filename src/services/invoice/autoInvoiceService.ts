
import { supabase } from '@/lib/supabaseClient';
import { pdfService } from './pdfService';
import { xmlService } from './xmlService';
import { storageService } from './storageService';
import { emailService } from './emailService';

/**
 * Service for handling automatic invoice generation
 */
export const autoInvoiceService = {
  /**
   * Handle automatic invoice generation after delivery confirmation
   */
  handleAutoInvoice: async (orderId: string, userId: string): Promise<void> => {
    try {
      console.log(`Auto-generating invoice for order ${orderId} and user ${userId}`);
      
      // Store the invoice files
      const storedPaths = await storageService.storeInvoice(orderId);
      if (!storedPaths) {
        console.error("Failed to store invoice files");
        return;
      }
      
      // Log invoice generation
      await supabase
        .from('delivery_logs')
        .insert({
          order_id: orderId,
          user_id: userId,
          action: 'invoice_generated',
        });
      
      // Get user email and send invoice
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('user_id', userId)
        .single();
      
      if (userError || !userData) {
        console.error("Error fetching user email:", userError);
        return;
      }
      
      // Send invoice to user's email
      await emailService.sendInvoiceEmail(orderId, userData.email);
      
      console.log(`Invoice for order ${orderId} generated and sent successfully`);
    } catch (error) {
      console.error("Error in automatic invoice generation:", error);
    }
  }
};


import { supabase } from '@/lib/supabaseClient';
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
      // Store invoice in Supabase Storage
      const storagePaths = await storageService.storeInvoice(orderId);
      
      if (!storagePaths) {
        console.error("Failed to store invoice");
        return;
      }
      
      // In a real app, get user email from Supabase
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
      
      // Log invoice generation
      await supabase
        .from('delivery_logs')
        .insert({
          order_id: orderId,
          user_id: userId,
          action: 'invoice_generated',
        });
      
    } catch (error) {
      console.error("Error handling automatic invoice:", error);
    }
  }
};

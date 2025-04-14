
import { supabase } from '@/lib/supabaseClient';
import { storageService } from './storageService';
import { emailService } from './emailService';
import { toast } from "@/hooks/use-toast";

/**
 * Service for handling automatic invoice generation
 */
export const autoInvoiceService = {
  /**
   * Handle automatic invoice generation after delivery confirmation
   */
  handleAutoInvoice: async (orderId: string, userId: string): Promise<boolean> => {
    try {
      // Get user email from database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('user_id', userId)
        .single();
      
      if (userError || !userData?.email) {
        console.error("Error fetching user email:", userError);
        return false;
      }
      
      // Send invoice to user's email
      const emailSent = await emailService.sendInvoiceEmail(orderId, userData.email);
      
      if (emailSent) {
        // Store invoice in Supabase Storage (for future reference)
        await storageService.storeInvoice(orderId);
        
        // Log invoice generation
        await supabase
          .from('delivery_logs')
          .insert({
            order_id: orderId,
            user_id: userId,
            action: 'invoice_sent',
          });
        
        toast({
          title: "Rechnung gesendet",
          description: `Rechnung wurde automatisch an ${userData.email} gesendet.`
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error handling automatic invoice:", error);
      toast({
        title: "Fehler",
        description: "Automatischer Rechnungsversand fehlgeschlagen.",
        variant: "destructive"
      });
      return false;
    }
  }
};

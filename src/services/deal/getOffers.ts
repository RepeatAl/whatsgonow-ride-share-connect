
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets all offers for an order
 */
export const getOffersForOrder = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        driver:profiles!driver_id (
          user_id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { success: true, offers: data || [] };
  } catch (error) {
    console.error('Error fetching offers for order:', error);
    return { success: false, error: (error as Error).message, offers: [] };
  }
};

/**
 * Gets the count of competing offers for an order
 */
export const getCompetingOfferCount = async (orderId: string, excludeUserId?: string) => {
  try {
    let query = supabase
      .from('offers')
      .select('offer_id', { count: 'exact' })
      .eq('order_id', orderId)
      .eq('status', 'eingereicht');
      
    if (excludeUserId) {
      query = query.neq('driver_id', excludeUserId);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error counting competing offers:', error);
    return { success: false, error: (error as Error).message, count: 0 };
  }
};


import { supabase } from "@/integrations/supabase/client";

/**
 * Get the user IDs of all participants in an order
 * (sender and any drivers with offers)
 */
export async function getOrderParticipants(orderId: string): Promise<string[]> {
  try {
    // Get the order's sender
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('sender_id')
      .eq('order_id', orderId)
      .single();
    
    if (orderError) throw orderError;
    
    const participants = [orderData.sender_id];
    
    // Get all drivers who have made offers for this order
    const { data: offersData, error: offersError } = await supabase
      .from('offers')
      .select('driver_id')
      .eq('order_id', orderId);
    
    if (offersError) throw offersError;
    
    // Add unique driver IDs to participants
    offersData.forEach(offer => {
      if (offer.driver_id && !participants.includes(offer.driver_id)) {
        participants.push(offer.driver_id);
      }
    });
    
    return participants;
  } catch (error) {
    console.error('Error getting order participants:', error);
    return [];
  }
}

/**
 * Get the partner ID in a conversation (not the current user)
 */
export async function getConversationPartner(orderId: string, currentUserId: string): Promise<string | null> {
  const participants = await getOrderParticipants(orderId);
  return participants.find(id => id !== currentUserId) || null;
}

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/types/order";

/**
 * Setzt ein Supabase-Realtime-Subscription für neue Aufträge auf.
 * @param userRegion Die Nutzerregion, um neue Aufträge darauf zu filtern
 * @param onNewOrder Callback bei neuen passenden Aufträgen
 * @returns Der Supabase-Channel für spätere Unsubscribe-Aufrufe
 */
export const setupOrderSubscription = (
  userRegion: string | null,
  onNewOrder: (order: Order) => void
): RealtimeChannel => {
  const ordersChannel = supabase.channel('orders_realtime');

  ordersChannel
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: 'status=eq.offen',
      },
      (payload) => {
        console.log('New order received:', payload);

        const newOrder = payload.new as Order;

        // Filter by region if applicable
        if (userRegion && newOrder.region && newOrder.region !== userRegion) {
          console.log(`Ignoring order from different region: ${newOrder.region}`);
          return;
        }

        // Notify about new order
        toast({
          title: "Neuer Auftrag verfügbar!",
          description: `${newOrder.description} von ${newOrder.from_address}`,
          variant: "default",
        });

        onNewOrder(newOrder);
      }
    )
    .subscribe();

  console.log('Subscribed to orders table for real-time updates');

  return ordersChannel;
};

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/types/order";

interface SubscriptionChannels {
  ordersStatusChannel: ReturnType<typeof supabase.channel>;
  offersChannel: ReturnType<typeof supabase.channel>;
  unsubscribe: () => void;
}

export const setupSenderOrdersSubscription = (
  userId: string,
  onOrderUpdate: () => void
): SubscriptionChannels => {
  const ordersStatusChannel = supabase.channel("orders_status_sender");
  const offersChannel = supabase.channel("offers_sender");

  // Subscribe to real-time updates for order status changes
  ordersStatusChannel
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `sender_id=eq.${userId}`,
      },
      (payload: any) => {
        console.log("Order status updated:", payload);
        const { new: newOrder, old: oldOrder } = payload;
        if (newOrder && oldOrder && newOrder.status !== oldOrder.status) {
          handleStatusChange(newOrder);
          onOrderUpdate();
        }
      }
    )
    .subscribe();

  // Subscribe to real-time updates for offers
  offersChannel
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "offers",
      },
      (payload: any) => {
        const newOffer = payload.new;
        if (!newOffer) return;
        console.log("New offer received:", newOffer);

        toast({
          title: "Neues Angebot eingegangen!",
          description: `Ein neues Angebot für ${newOffer.price}€ wurde für deinen Auftrag abgegeben.`,
          variant: "default",
        });
      }
    )
    .subscribe();

  console.log(`Subscribed to updates for sender ${userId}`);

  // Optional: unsubscribe convenience
  const unsubscribe = () => {
    ordersStatusChannel.unsubscribe();
    offersChannel.unsubscribe();
  };

  return {
    ordersStatusChannel,
    offersChannel,
    unsubscribe,
  };
};

const handleStatusChange = (order: Order) => {
  switch (order.status) {
    case "matched":
      toast({
        title: "Auftrag angenommen",
        description: `Dein Auftrag ${order.description} wurde angenommen.`,
        variant: "default",
      });
      break;
    case "unterwegs":
      toast({
        title: "Paket unterwegs",
        description: `Dein Paket ${order.description} ist jetzt unterwegs.`,
        variant: "default",
      });
      break;
    case "abgeschlossen":
      toast({
        title: "Lieferung abgeschlossen",
        description: `Die Lieferung für ${order.description} wurde abgeschlossen.`,
        variant: "default",
      });
      break;
    default:
      break;
  }
};

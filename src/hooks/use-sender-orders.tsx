
import { useEffect } from "react";
import { useSenderAuth } from "./sender/use-sender-auth";
import { useSenderData } from "./sender/use-sender-data";
import { setupSenderOrdersSubscription } from "./sender/use-sender-orders-subscription";
import { supabase } from "@/integrations/supabase/client";

export type { Order } from "../types/order";
export type { UserWithRole } from "../types/order";

export const useSenderOrders = () => {
  const { user } = useSenderAuth();
  const { orders, loading, fetchOrders } = useSenderData();

  useEffect(() => {
    if (user?.id) {
      fetchOrders(user.id);
      const { ordersStatusChannel, offersChannel } = setupSenderOrdersSubscription(
        user.id,
        () => fetchOrders(user.id)
      );

      return () => {
        supabase.removeChannel(ordersStatusChannel);
        supabase.removeChannel(offersChannel);
      };
    }
  }, [user]);

  return {
    user,
    orders,
    loading,
    fetchOrders: () => user?.id && fetchOrders(user.id)
  };
};


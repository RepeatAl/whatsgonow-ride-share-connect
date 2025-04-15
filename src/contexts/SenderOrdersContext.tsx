
import React, { createContext, useContext, useEffect } from "react";
import { useSenderAuth } from "@/hooks/sender/use-sender-auth";
import { useSenderData } from "@/hooks/sender/use-sender-data";
import { setupSenderOrdersSubscription } from "@/hooks/sender/use-sender-orders-subscription";
import { supabase } from "@/integrations/supabase/client";
import { Order, UserWithRole } from "@/types/order";

interface SenderOrdersContextType {
  user: UserWithRole | null;
  orders: Order[];
  loading: boolean;
  fetchOrders: () => void;
}

const SenderOrdersContext = createContext<SenderOrdersContextType | undefined>(undefined);

export function SenderOrdersProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <SenderOrdersContext.Provider
      value={{
        user,
        orders,
        loading,
        fetchOrders: () => user?.id && fetchOrders(user.id),
      }}
    >
      {children}
    </SenderOrdersContext.Provider>
  );
}

export function useSenderOrders() {
  const context = useContext(SenderOrdersContext);
  if (context === undefined) {
    throw new Error("useSenderOrders must be used within a SenderOrdersProvider");
  }
  return context;
}

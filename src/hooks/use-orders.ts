import { useEffect } from "react";
import { useOrderAuth } from "./orders/use-order-auth";
import { useOrderData } from "./orders/use-order-data";
import { useOrderFilters } from "./orders/use-order-filters";
import { setupOrderSubscription } from "./orders/use-order-subscription";
import { supabase } from "@/integrations/supabase/client";

export type { Order } from "@/types/order";
export type { UserWithRole } from "@/types/order";

export const useOrders = () => {
  const { user, loading: authLoading } = useOrderAuth();
  const { orders, loading: dataLoading, fetchOrders, addNewOrder } = useOrderData();
  const { filteredOrders, selectedRegion, setSelectedRegion, maxWeight, setMaxWeight } = useOrderFilters(orders);

  useEffect(() => {
    if (user) {
      fetchOrders();
      const ordersChannel = setupOrderSubscription(user.region, addNewOrder);

      return () => {
        supabase.removeChannel(ordersChannel);
      };
    }
  }, [user]);

  return {
    user,
    orders,
    filteredOrders,
    loading: authLoading || dataLoading,
    selectedRegion,
    setSelectedRegion,
    maxWeight,
    setMaxWeight,
    fetchOrders
  };
};

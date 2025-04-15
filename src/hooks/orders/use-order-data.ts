
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/types/order";

export const useOrderData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "offen");
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error("Fehler beim Laden der Aufträge:", error);
      toast({
        title: "Fehler",
        description: "Die Aufträge konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewOrder = (order: Order) => {
    setOrders(currentOrders => {
      if (currentOrders.some(o => o.order_id === order.order_id)) {
        return currentOrders;
      }
      return [order, ...currentOrders];
    });
  };

  return {
    orders,
    loading,
    fetchOrders,
    addNewOrder
  };
};

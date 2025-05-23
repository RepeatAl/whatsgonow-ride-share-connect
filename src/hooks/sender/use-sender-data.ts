import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/types/order";

export const useSenderData = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, transactions(*)")
        .eq("sender_id", userId);

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
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

  return {
    orders,
    loading,
    fetchOrders,
  };
};


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Order = {
  order_id: string;
  description: string;
  from_address: string;
  to_address: string;
  weight: number;
  deadline: string;
  status: string;
  sender_id: string;
  verified_at?: string;
};

export const useSenderOrders = () => {
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      // Get the user's role from the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id, role")
        .eq("user_id", session.user.id)
        .single();
      
      if (userError || !userData) {
        toast({
          title: "Fehler beim Laden des Benutzerprofils",
          description: "Bitte versuche es später erneut.",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      }
      
      // Set user with role
      setUser({
        id: session.user.id,
        role: userData.role
      });
      
      // Fetch orders
      fetchOrders(session.user.id);

      // Subscribe to real-time updates for order status changes
      subscribeToOrderUpdates(session.user.id);

      // Subscribe to real-time updates for offers
      subscribeToOfferUpdates(session.user.id);
    };

    checkAuth();

    // Cleanup function to remove subscriptions when unmounting
    return () => {
      supabase.removeChannel(ordersStatusChannel);
      supabase.removeChannel(offersChannel);
    };
  }, [navigate]);

  // Set up Supabase Realtime channels
  const ordersStatusChannel = supabase.channel('orders_status_sender');
  const offersChannel = supabase.channel('offers_sender');

  // Subscribe to real-time updates for order status changes
  const subscribeToOrderUpdates = (userId: string) => {
    ordersStatusChannel
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `sender_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Order status updated:', payload);
          
          // Handle status change notifications
          const { new: newOrder, old: oldOrder } = payload;
          const statusChanged = newOrder.status !== oldOrder.status;
          
          if (statusChanged) {
            handleStatusChange(newOrder);
            
            // Update the order in the state
            setOrders(currentOrders => {
              return currentOrders.map(order => 
                order.order_id === newOrder.order_id 
                  ? { ...order, status: newOrder.status } 
                  : order
              );
            });
          }
        }
      )
      .subscribe();

    console.log(`Subscribed to order status updates for sender ${userId}`);
  };

  // Subscribe to real-time updates for offers
  const subscribeToOfferUpdates = (userId: string) => {
    // First, get the orders from this sender
    supabase
      .from("orders")
      .select("order_id")
      .eq("sender_id", userId)
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Error fetching orders for offers subscription:", error);
          return;
        }

        const orderIds = data.map(order => order.order_id);
        
        // Now subscribe to offer changes for these orders
        if (orderIds.length > 0) {
          offersChannel
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'offers',
              },
              (payload) => {
                const newOffer = payload.new;
                
                // Check if the offer is for one of the user's orders
                if (orderIds.includes(newOffer.order_id)) {
                  console.log('New offer received:', newOffer);
                  
                  // Show toast notification
                  toast({
                    title: "Neues Angebot eingegangen!",
                    description: `Ein neues Angebot für ${newOffer.price}€ wurde für deinen Auftrag abgegeben.`,
                    variant: "default"
                  });
                  
                  // You could also update the state here if you're tracking offers
                }
              }
            )
            .subscribe();
          
          console.log(`Subscribed to offer updates for sender ${userId}`);
        }
      });
  };

  const handleStatusChange = (order: any) => {
    switch (order.status) {
      case "matched":
        toast({
          title: "Auftrag angenommen",
          description: `Dein Auftrag ${order.description} wurde angenommen.`,
          variant: "default"
        });
        break;
      case "unterwegs":
        toast({
          title: "Paket unterwegs",
          description: `Dein Paket ${order.description} ist jetzt unterwegs.`,
          variant: "default"
        });
        break;
      case "abgeschlossen":
        toast({
          title: "Lieferung abgeschlossen",
          description: `Die Lieferung für ${order.description} wurde abgeschlossen.`,
          variant: "default"
        });
        break;
      default:
        // No toast for other status changes
        break;
    }
  };

  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, transactions(*)")
        .eq("sender_id", userId);
      
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

  return {
    user,
    orders,
    loading,
    fetchOrders: () => user?.id && fetchOrders(user.id)
  };
};

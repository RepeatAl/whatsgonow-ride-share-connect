
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Truck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
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
    };

    checkAuth();

    // Cleanup function to remove subscription when unmounting
    return () => {
      supabase.removeChannel(ordersStatusChannel);
    };
  }, [navigate]);

  // Set up Supabase Realtime channel
  const ordersStatusChannel = supabase.channel('orders_status_sender');

  // Subscribe to real-time updates for order status changes
  const subscribeToOrderUpdates = (userId: string) => {
    ordersStatusChannel
      .on(
        'postgres_changes' as any, // Use type assertion to fix TypeScript error
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

  const handleStatusChange = (order: any) => {
    switch (order.status) {
      case "matched":
        toast({
          title: "Auftrag angenommen",
          description: `Dein Auftrag ${order.description} wurde angenommen.`,
          variant: "default",
          icon: <Check className="h-4 w-4" />,
        });
        break;
      case "unterwegs":
        toast({
          title: "Paket unterwegs",
          description: `Dein Paket ${order.description} ist jetzt unterwegs.`,
          variant: "default",
          icon: <Truck className="h-4 w-4" />,
        });
        break;
      case "abgeschlossen":
        toast({
          title: "Lieferung abgeschlossen",
          description: `Die Lieferung für ${order.description} wurde abgeschlossen.`,
          variant: "default",
          icon: <Check className="h-4 w-4" />,
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
        .select("*")
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

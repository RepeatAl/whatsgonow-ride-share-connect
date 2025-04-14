
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  region?: string;
};

// Define a proper type for the user object
type UserWithRole = {
  id: string;
  role: string;
  region?: string;
};

export const useOrders = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [maxWeight, setMaxWeight] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      // Get the user's role and region from the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id, role, region")
        .eq("user_id", session.user.id)
        .single();
      
      if (userError || !userData || userData.role !== "driver") {
        toast({
          title: "Zugriff verweigert",
          description: "Du hast keine Berechtigung, diese Seite zu sehen.",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      }
      
      // Set user with role and region
      setUser({
        id: session.user.id,
        role: userData.role,
        region: userData.region
      });
      
      // Fetch orders
      fetchOrders();

      // Subscribe to real-time updates for new orders
      subscribeToOrderUpdates(userData.region);
    };

    checkAuth();

    // Cleanup function to remove subscription when unmounting
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [navigate]);

  // Set up Supabase Realtime channel
  const ordersChannel = supabase.channel('orders_realtime');

  // Subscribe to real-time updates for new orders
  const subscribeToOrderUpdates = (userRegion: string | null) => {
    let filter = {
      event: 'INSERT',
      schema: 'public',
      table: 'orders',
      filter: 'status=eq.offen',
    };

    // Add region filter if user has a region
    if (userRegion) {
      console.log(`Subscribing to orders in region: ${userRegion}`);
      // Note: in a real implementation, you might need to filter by region in the database
      // or handle the filtering in the payload callback
    }

    ordersChannel
      .on(
        'postgres_changes' as any, // Use type assertion to fix TypeScript error
        filter,
        (payload) => {
          console.log('New order received:', payload);
          
          const newOrder = payload.new as Order;
          
          // Filter by region if applicable
          if (userRegion && newOrder.region && newOrder.region !== userRegion) {
            console.log(`Ignoring order from different region: ${newOrder.region}`);
            return;
          }
          
          // Add new order to the state
          setOrders(currentOrders => {
            // Check if order already exists
            if (currentOrders.some(order => order.order_id === newOrder.order_id)) {
              return currentOrders;
            }
            return [newOrder, ...currentOrders];
          });
          
          // Show toast notification
          toast({
            title: "Neuer Auftrag verfügbar!",
            description: `${newOrder.description} von ${newOrder.from_address}`,
            variant: "default",
          });
        }
      )
      .subscribe();

    console.log('Subscribed to orders table for real-time updates');
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "offen");
      
      if (error) throw error;
      
      setOrders(data || []);
      setFilteredOrders(data || []);
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

  // Helper function to extract region from address
  const extractRegionFromAddress = (address: string) => {
    // In a real app, this would be more sophisticated
    // For demo, we'll just check for region names in the address
    const regions = ["North", "South", "East", "West", "Central"];
    for (const region of regions) {
      if (address.includes(region)) {
        return region;
      }
    }
    return "unknown";
  };

  useEffect(() => {
    // Apply filters whenever they change
    const applyFilters = () => {
      let filtered = [...orders];
      
      // Filter by region
      if (selectedRegion !== "all") {
        filtered = filtered.filter(order => {
          // Extract region from address or use stored region if available
          const region = order.region || extractRegionFromAddress(order.from_address);
          return region === selectedRegion;
        });
      }
      
      // Filter by weight
      filtered = filtered.filter(order => order.weight <= maxWeight);
      
      setFilteredOrders(filtered);
    };
    
    applyFilters();
  }, [selectedRegion, maxWeight, orders]);

  return {
    user,
    orders,
    filteredOrders,
    loading,
    selectedRegion,
    setSelectedRegion,
    maxWeight,
    setMaxWeight,
    fetchOrders
  };
};

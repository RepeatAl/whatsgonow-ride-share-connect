
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchUserRegion } from "@/utils/regionUtils";

interface DashboardStats {
  totalUsers: number;
  activeOrders: number;
  completedDeliveries: number;
  avgRating: number;
}

export const useManagerDashboard = (selectedRegion: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeOrders: 0,
    completedDeliveries: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Build region filter based on new structure
        let regionFilter = '';
        if (selectedRegion !== "all") {
          regionFilter = `region_id.eq.${selectedRegion}`;
        }

        // Fetch users with region filter
        let usersQuery = supabase
          .from('profiles')
          .select(`
            *,
            cm_regions!inner(
              region_name,
              country_code,
              state_province,
              city_name
            )
          `);

        if (regionFilter) {
          usersQuery = usersQuery.eq('region_id', selectedRegion);
        }

        const { data: usersData, error: usersError } = await usersQuery;

        if (usersError) {
          console.error("Error fetching users:", usersError);
        } else {
          setUsers(usersData || []);
        }

        // Fetch orders (with region-based filtering if CM role)
        let ordersQuery = supabase
          .from('orders')
          .select(`
            *,
            profiles!inner(
              region_id,
              cm_regions!inner(region_name)
            )
          `);

        if (regionFilter) {
          ordersQuery = ordersQuery.eq('profiles.region_id', selectedRegion);
        }

        const { data: ordersData, error: ordersError } = await ordersQuery;

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          setOrders(ordersData || []);
        }

        // Calculate stats based on filtered data
        const totalUsers = usersData?.length || 0;
        const activeOrders = ordersData?.filter(order => 
          ['published', 'matched', 'in_progress'].includes(order.status)
        ).length || 0;
        const completedDeliveries = ordersData?.filter(order => 
          order.status === 'completed'
        ).length || 0;

        // Calculate average rating (simplified)
        const avgRating = 4.2; // Placeholder - would need proper rating calculation

        setStats({
          totalUsers,
          activeOrders,
          completedDeliveries,
          avgRating,
        });

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedRegion]);

  return {
    users,
    orders,
    stats,
    loading,
  };
};

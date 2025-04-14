
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  orders_count: number;
  rating_avg: number;
}

export const useFetchUsers = (region: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!region) {
        setLoading(false);
        return;
      }

      try {
        // Fetch users data from the region
        const { data, error } = await supabase
          .from("users")
          .select("user_id, name, email, role, created_at")
          .eq("region", region);

        if (error) throw error;

        // For each user, fetch their orders count and average rating
        const enrichedUsers = await Promise.all((data || []).map(async (user) => {
          // Fetch orders count for this user
          const { count: ordersCount, error: ordersError } = await supabase
            .from("orders")
            .select("order_id", { count: "exact" })
            .eq("sender_id", user.user_id);

          if (ordersError) console.error("Error fetching orders:", ordersError);

          // Fetch average rating for this user
          const { data: ratingsData, error: ratingsError } = await supabase
            .from("ratings")
            .select("score")
            .eq("to_user", user.user_id);

          if (ratingsError) console.error("Error fetching ratings:", ratingsError);

          const ratingAvg = ratingsData && ratingsData.length > 0 
            ? ratingsData.reduce((acc, curr) => acc + (curr.score || 0), 0) / ratingsData.length 
            : 0;

          return {
            ...user,
            orders_count: ordersCount || 0,
            rating_avg: Number(ratingAvg.toFixed(1))
          };
        }));

        setUsers(enrichedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Fehler beim Laden",
          description: "Nutzerdaten konnten nicht geladen werden.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [region]);

  return { users, loading };
};

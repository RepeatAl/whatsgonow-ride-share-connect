import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ActivityItem {
  id: string;
  type: "order" | "offer" | "rating" | "transaction";
  user_name: string;
  user_id: string;
  timestamp: string;
  description: string;
  status?: string;
}

export const useActivityData = (region: string) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!region) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Get a timestamp for 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // --- WICHTIG: Foreign Table oder direktes Feld? ---
        // Prüfe ggf. die Struktur in Supabase!

        // Load orders from this region (assuming region on orders table)
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select(`
            order_id,
            sender_id,
            status,
            description,
            deadline,
            users(name)
          `)
          .eq("region", region) // <--- ggf. anpassen, falls Join nicht unterstützt
          .gte("deadline", thirtyDaysAgo.toISOString())
          .order("deadline", { ascending: false })
          .limit(10);

        if (ordersError) throw ordersError;

        // Load ratings from this region (assuming region on ratings table)
        const { data: ratings, error: ratingsError } = await supabase
          .from("ratings")
          .select(`
            rating_id,
            from_user,
            to_user,
            score,
            comment,
            users(name, region)
          `)
          .eq("region", region) // <--- ggf. anpassen, falls Join nicht unterstützt
          .order("created_at", { ascending: false })
          .limit(5);

        if (ratingsError) throw ratingsError;

        // Combine and format all activities
        const orderActivities = (orders || []).map((order: any) => {
          // Extract name safely
          const userName = order.users?.[0]?.name || "Unknown User";

          return {
            id: order.order_id,
            type: "order" as const,
            user_name: userName,
            user_id: order.sender_id,
            timestamp: order.deadline,
            description: order.description,
            status: order.status,
          };
        });

        const ratingActivities = (ratings || []).map((rating: any) => {
          // Extract name safely
          const userName = rating.users?.[0]?.name || "Unknown User";

          return {
            id: rating.rating_id,
            type: "rating" as const,
            user_name: userName,
            user_id: rating.from_user,
            timestamp: new Date().toISOString(),
            description: `Bewertung: ${rating.score}/5${rating.comment ? ` – "${rating.comment}"` : ""}`,
          };
        });

        // Combine all activities and sort by date
        const allActivities = [...orderActivities, ...ratingActivities]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 15); // Limit to most recent 15 activities

        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        // Optional: Toast hier ergänzen, falls gewünscht
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [region]);

  return { activities, loading };
};


import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Ride } from "@/components/rides/types";

export const useMyRides = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRides();
  }, []);

  const fetchMyRides = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Nicht angemeldet");
      }

      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("driver_id", user.id)
        .order("departure_time", { ascending: true });

      if (error) throw error;

      setRides(data || []);
    } catch (err) {
      console.error("Error fetching rides:", err);
      setError(err instanceof Error ? err.message : "Fehler beim Laden der Fahrten");
    } finally {
      setLoading(false);
    }
  };

  const deleteRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from("rides")
        .delete()
        .eq("id", rideId);

      if (error) throw error;

      setRides(rides.filter(ride => ride.id !== rideId));
    } catch (err) {
      console.error("Error deleting ride:", err);
      throw err;
    }
  };

  return { rides, loading, error, fetchMyRides, deleteRide };
};

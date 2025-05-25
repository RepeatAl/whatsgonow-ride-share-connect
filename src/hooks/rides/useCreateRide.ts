
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { CreateRideForm } from "@/components/rides/types";

export const useCreateRide = () => {
  const [loading, setLoading] = useState(false);

  const createRide = async (data: CreateRideForm) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Nicht angemeldet");
      }

      // Prüfe ob User ein verifizierter Fahrer ist
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, verified")
        .eq("user_id", user.id)
        .single();

      if (profile?.role !== "driver") {
        throw new Error("Nur Fahrer können Fahrten erstellen");
      }

      if (!profile?.verified) {
        throw new Error("Profil muss verifiziert sein um Fahrten zu erstellen");
      }

      const { data: ride, error } = await supabase
        .from("rides")
        .insert({
          driver_id: user.id,
          ...data,
          departure_time: new Date(data.departure_time).toISOString(),
          arrival_time: data.arrival_time ? new Date(data.arrival_time).toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Fahrt erfolgreich erstellt",
        description: "Deine Fahrt ist jetzt für Auftraggeber sichtbar."
      });

      return ride;
    } catch (error) {
      console.error("Error creating ride:", error);
      toast({
        title: "Fehler beim Erstellen der Fahrt",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createRide, loading };
};

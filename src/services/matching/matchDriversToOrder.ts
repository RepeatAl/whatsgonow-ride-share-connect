
import { supabase } from "@/lib/supabaseClient";
import { Order } from "@/types/order";

// Typ für Rückgabe
export type MatchedDriver = {
  user_id: string;
  region: string;
  vehicle_type?: string; // Fahrzeugtyp des Fahrers
  name?: string;
  profile_photo_url?: string;
  rating?: number;
  match_score?: number; // Optional: Bewertung der Übereinstimmung (0-100)
};

/**
 * Findet passende Fahrer für einen gegebenen Auftrag
 * basierend auf der Region und anderen Kriterien.
 * 
 * @param orderId ID des Auftrags für den Fahrer gesucht werden
 * @returns Array mit passenden Fahrern
 */
export async function matchDriversToOrder(orderId: string): Promise<MatchedDriver[]> {
  console.log("Matching started for order:", orderId);
  
  try {
    // Auftragsdaten abrufen
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();
    
    if (orderError || !orderData) {
      console.error("Fehler beim Laden des Auftrags:", orderError);
      return [];
    }
    
    // Prüfen ob der Auftrag passende Kritierien erfüllt
    if (orderData.status !== "open") {
      console.log(`Auftrag ${orderId} ist nicht offen (Status: ${orderData.status})`);
      return [];
    }
    
    // Region des Auftrags bestimmen (für regionales Matching)
    const orderRegion = orderData.region;
    
    // Wenn keine Region verfügbar ist, keine Fahrer vorschlagen
    if (!orderRegion) {
      console.log("Keine Region für den Auftrag festgelegt");
      return [];
    }
    
    // Matching-Logik: Passende Fahrer basierend auf Region finden
    const { data: drivers, error: driversError } = await supabase
      .from("profiles")
      .select("user_id, region, first_name, last_name, avatar_url")
      .eq("role", "driver")
      .eq("region", orderRegion)
      .eq("verified", true); // Nur verifizierte Fahrer
    
    if (driversError) {
      console.error("Fehler beim Abfragen passender Fahrer:", driversError);
      return [];
    }
    
    // Fahrer-Daten aufbereiten und zurückgeben
    const matchedDrivers: MatchedDriver[] = drivers?.map(driver => {
      // Kombinierter Name aus Vor- und Nachname
      const name = driver.first_name && driver.last_name 
        ? `${driver.first_name} ${driver.last_name}`
        : driver.first_name || "Unnamed Driver";
      
      return {
        user_id: driver.user_id,
        region: driver.region || "",
        name,
        profile_photo_url: driver.avatar_url || undefined,
        // Basis-Matching-Score (kann später erweitert werden)
        match_score: 100 // Einfacher Score für Regionsübereinstimmung
      };
    }) || [];
    
    console.log(`${matchedDrivers.length} passende Fahrer für Auftrag ${orderId} gefunden`);
    return matchedDrivers;
    
  } catch (error) {
    console.error("Unerwarteter Fehler beim Matching-Prozess:", error);
    return [];
  }
}


import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { matchDriversToOrder } from "@/services/matching/matchDriversToOrder";

interface PublishOrderResult {
  success: boolean;
  error?: string;
}

export async function publishOrder(orderId: string): Promise<PublishOrderResult> {
  try {
    const { data, error } = await supabase.functions.invoke('publish-order', {
      body: { orderId }
    });

    if (error) {
      console.error("Fehler beim Veröffentlichen des Auftrags:", error);
      return { 
        success: false, 
        error: error.message || "Fehler beim Veröffentlichen des Auftrags" 
      };
    }

    // Nach erfolgreicher Veröffentlichung das Matching starten
    try {
      await matchDriversToOrder(orderId);
    } catch (matchError) {
      // Matching-Fehler loggen, aber den Erfolg der Veröffentlichung nicht beeinflussen
      console.warn("Matching konnte nicht durchgeführt werden:", matchError);
    }

    return { 
      success: true 
    };
  } catch (error) {
    console.error("Unerwarteter Fehler beim Veröffentlichen:", error);
    return { 
      success: false, 
      error: "Unerwarteter Fehler beim Veröffentlichen des Auftrags" 
    };
  }
}

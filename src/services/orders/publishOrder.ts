
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

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

    // Optional: Hier könnte später das Matching gestartet werden
    // await matchDriversToOrder(orderId);

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

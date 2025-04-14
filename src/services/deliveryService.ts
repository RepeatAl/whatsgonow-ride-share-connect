
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface DeliveryVerificationResult {
  success: boolean;
  message: string;
  error?: string;
}

export const deliveryService = {
  // Generate a QR code token for an order
  generateToken: async (orderId: string, userId: string): Promise<string | null> => {
    try {
      // Check if order already has a token
      const { data, error } = await supabase
        .from("orders")
        .select("qr_code_token, status")
        .eq("order_id", orderId)
        .single();

      if (error) throw error;
      
      // Check if order is already completed
      if (data.status === "abgeschlossen") {
        throw new Error("Diese Lieferung wurde bereits bestätigt");
      }

      // Use existing token or generate a new one
      let token = data.qr_code_token;
      
      if (!token) {
        token = `delivery-${orderId}-${uuidv4()}`;
        
        // Set token expiration time (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        
        const { error: updateError } = await supabase
          .from("orders")
          .update({ 
            qr_code_token: token,
            token_expires_at: expiresAt.toISOString()
          })
          .eq("order_id", orderId);
        
        if (updateError) throw updateError;
        
        // Log token generation
        await supabase
          .from("delivery_logs")
          .insert({
            order_id: orderId,
            user_id: userId,
            action: "token_generated"
          });
      }
      
      return token;
    } catch (error) {
      console.error("Error generating delivery token:", error);
      return null;
    }
  },
  
  // Verify a QR code token
  verifyDelivery: async (orderId: string, token: string, userId: string): Promise<DeliveryVerificationResult> => {
    try {
      // Check if the order exists and token matches
      const { data, error } = await supabase
        .from("orders")
        .select("status, token_expires_at, qr_code_token")
        .eq("order_id", orderId)
        .single();

      if (error) {
        return {
          success: false,
          message: "Auftrag nicht gefunden",
          error: error.message
        };
      }
      
      // Validate token
      if (data.qr_code_token !== token) {
        return {
          success: false,
          message: "Ungültiger QR-Code",
          error: "Token mismatch"
        };
      }
      
      // Check if order is already completed
      if (data.status === "abgeschlossen") {
        return {
          success: false,
          message: "Diese Lieferung wurde bereits bestätigt",
          error: "Already verified"
        };
      }

      // Check if token has expired
      if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
        return {
          success: false,
          message: "Der QR-Code ist abgelaufen",
          error: "Token expired"
        };
      }

      // Update order status and mark as verified
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: "abgeschlossen", 
          verified_at: now,
          qr_code_token: null // Invalidate the token after use
        })
        .eq("order_id", orderId);
      
      if (updateError) {
        return {
          success: false,
          message: "Fehler beim Aktualisieren des Auftragsstatus",
          error: updateError.message
        };
      }

      // Log successful verification
      await supabase
        .from("delivery_logs")
        .insert({
          order_id: orderId,
          user_id: userId,
          action: "delivery_confirmed"
        });

      return {
        success: true,
        message: "Lieferung erfolgreich bestätigt"
      };
    } catch (error) {
      console.error("Error verifying delivery:", error);
      return {
        success: false,
        message: "Bei der Überprüfung ist ein Fehler aufgetreten",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
};

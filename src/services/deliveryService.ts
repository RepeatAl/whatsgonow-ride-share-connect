
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { invoiceService } from "@/services/invoice";

export interface DeliveryVerificationResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Helper function to log delivery actions
 */
const logDeliveryAction = async (orderId: string, userId: string, action: string): Promise<void> => {
  try {
    await supabase
      .from("delivery_logs")
      .insert({
        order_id: orderId,
        user_id: userId,
        action
      });
  } catch (error) {
    console.error("Error logging delivery action:", error);
  }
};

/**
 * Check if an order token has expired
 */
const isTokenExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
};

export const deliveryService = {
  // Generate a QR code token for an order
  generateToken: async (orderId: string, userId: string): Promise<string | null> => {
    try {
      // Check if order already has a token
      const { data, error } = await supabase
        .from("orders")
        .select("qr_code_token, status, token_expires_at")
        .eq("order_id", orderId)
        .single();

      if (error) throw error;
      
      // Check if order is already completed
      if (data.status === "abgeschlossen") {
        throw new Error("Diese Lieferung wurde bereits bestätigt");
      }

      // Check if token is still valid
      let token = data.qr_code_token;
      const tokenExpired = isTokenExpired(data.token_expires_at);
      
      if (!token || tokenExpired) {
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
        await logDeliveryAction(orderId, userId, "token_generated");
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
        .select("status, token_expires_at, qr_code_token, sender_id")
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
      if (isTokenExpired(data.token_expires_at)) {
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
      await logDeliveryAction(orderId, userId, "delivery_confirmed");

      // Automatically generate and send invoice
      if (data.sender_id) {
        try {
          // Send invoice in background to avoid blocking the response
          setTimeout(() => {
            invoiceService.handleAutoInvoice(orderId, data.sender_id)
              .catch(err => console.error("Error in auto invoice processing:", err));
          }, 100);
        } catch (invoiceError) {
          console.error("Error starting invoice process:", invoiceError);
          // Don't return error - delivery was still successful
        }
      }

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

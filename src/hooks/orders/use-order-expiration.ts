import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { useSystemAudit } from "@/hooks/use-system-audit";
import { AuditEventType, AuditEntityType } from "@/constants/auditEvents";

export type OrderWithExpiry = {
  order_id: string;
  status: string;
  expires_at: string | null;
  created_at: string;
};

export const useOrderExpiration = (orderId: string) => {
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasExpired, setHasExpired] = useState(false);
  const { logEvent } = useSystemAudit();

  // Lädt die Ablaufzeit des Auftrags
  const fetchExpiryDate = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("order_id, status, expires_at, created_at")
        .eq("order_id", orderId)
        .single();

      if (error) throw error;

      if (data && data.expires_at) {
        const expiry = new Date(data.expires_at);
        setExpiryDate(expiry);

        // Prüfe, ob der Auftrag bereits abgelaufen ist
        const now = new Date();
        if (now > expiry && data.status === 'offer_pending') {
          setHasExpired(true);
          handleOrderExpired(data);
        }
      } else if (data && data.created_at && data.status === 'offer_pending') {
        // Wenn kein explizites Ablaufdatum gesetzt ist, verwenden wir das Erstellungsdatum + 3 Tage
        const createdAt = new Date(data.created_at);
        const defaultExpiry = new Date(createdAt);
        defaultExpiry.setDate(defaultExpiry.getDate() + 3);
        setExpiryDate(defaultExpiry);

        // Prüfe, ob der Auftrag bereits abgelaufen ist
        const now = new Date();
        if (now > defaultExpiry) {
          setHasExpired(true);
          handleOrderExpired(data);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden des Ablaufdatums:", error);
      toast({
        title: "Fehler",
        description: "Das Ablaufdatum konnte nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Markiert einen Auftrag als abgelaufen
  const handleOrderExpired = useCallback(async (order: OrderWithExpiry) => {
    try {
      // Aktualisiere den Status in der Datenbank
      const { error } = await supabase
        .from("orders")
        .update({ status: "expired" })
        .eq("order_id", order.order_id);

      if (error) throw error;

      // Erstelle einen Audit-Log-Eintrag
      await logEvent({
        eventType: AuditEventType.ORDER_EXPIRED,
        entityType: AuditEntityType.ORDER,
        entityId: order.order_id,
        actorId: 'system',
        metadata: {
          previousStatus: order.status,
          expiresAt: order.expires_at
        }
      });

      toast({
        title: "Auftrag abgelaufen",
        description: "Der Auftrag ist abgelaufen, da keine Angebote innerhalb der Frist angenommen wurden.",
        variant: "default"
      });
    } catch (error) {
      console.error("Fehler beim Markieren des Auftrags als abgelaufen:", error);
    }
  }, [logEvent]);

  // Setzt manuell den Status eines Auftrags auf "abgelaufen"
  const expireOrderNow = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("order_id, status, expires_at")
        .eq("order_id", orderId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from("orders")
        .update({ status: "expired" })
        .eq("order_id", orderId);

      if (error) throw error;

      // Erstelle einen Audit-Log-Eintrag
      await logEvent({
        eventType: AuditEventType.ORDER_EXPIRED,
        entityType: AuditEntityType.ORDER,
        entityId: orderId,
        actorId: 'system',
        metadata: {
          previousStatus: data.status,
          manualExpiration: true
        }
      });

      setHasExpired(true);
      toast({
        title: "Auftrag abgelaufen",
        description: "Der Auftrag wurde manuell als abgelaufen markiert.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error("Fehler beim manuellen Markieren des Auftrags als abgelaufen:", error);
      toast({
        title: "Fehler",
        description: "Der Auftrag konnte nicht als abgelaufen markiert werden.",
        variant: "destructive"
      });
      return false;
    }
  }, [orderId, logEvent]);

  useEffect(() => {
    fetchExpiryDate();
  }, [fetchExpiryDate]);

  return {
    expiryDate,
    loading,
    hasExpired,
    expireOrderNow,
    refreshExpiryDate: fetchExpiryDate
  };
};

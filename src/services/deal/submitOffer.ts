
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { SubmitOfferParams } from './types';

/**
 * Submits a new offer for an order
 */
export const submitOffer = async ({
  orderId,
  driverId,
  price,
  message
}: SubmitOfferParams) => {
  const { logEvent } = useSystemAudit();

  try {
    // Auftrag abrufen und prüfen
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('status, price')
      .eq('order_id', orderId)
      .single();

    if (orderError || !order) {
      return {
        success: false,
        error: `Auftrag konnte nicht abgerufen werden: ${orderError?.message || 'Unbekannter Fehler'}`
      };
    }

    if (order.status !== 'created' && order.status !== 'offer_pending') {
      return {
        success: false,
        error: `Der Auftrag ist nicht mehr für Angebote verfügbar. Aktueller Status: ${order.status}`
      };
    }

    // Angebot speichern
    const { data: newOffer, error: insertError } = await supabase
      .from('offers')
      .insert({
        order_id: orderId,
        driver_id: driverId,
        price,
        status: 'eingereicht',
        message
      })
      .select()
      .single();

    if (insertError || !newOffer) {
      return {
        success: false,
        error: `Angebot konnte nicht gespeichert werden: ${insertError?.message || 'Unbekannter Fehler'}`
      };
    }

    // Audit-Log
    await logEvent({
      eventType: AuditEventType.OFFER_SUBMITTED,
      entityType: AuditEntityType.OFFER,
      entityId: newOffer.offer_id,
      actorId: driverId,
      targetId: orderId,
      metadata: {
        price,
        originalPrice: order.price,
        message
      },
      severity: AuditSeverity.INFO
    });

    // Status aktualisieren
    if (order.status === 'created') {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'offer_pending' })
        .eq('order_id', orderId);

      if (updateError) {
        console.warn('Warnung: Auftragstatus konnte nicht aktualisiert werden:', updateError);
      }
    }

    return { success: true, data: newOffer };

  } catch (error) {
    console.error('Fehler beim Einreichen des Angebots:', error);
    return { success: false, error: (error as Error).message };
  }
};

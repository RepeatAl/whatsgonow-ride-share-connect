
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';

export interface SubmitOfferParams {
  orderId: string;
  driverId: string;
  price: number;
  message?: string;
}

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

export const acceptOffer = async (offerId: string, orderId: string, userId: string) => {
  const { logEvent } = useSystemAudit();
  
  // PostgreSQL Transaction mit FOR UPDATE Lock
  const { data, error } = await supabase.rpc('accept_offer_with_lock', {
    p_offer_id: offerId,
    p_order_id: orderId,
    p_user_id: userId
  });
  
  if (error) {
    // Log failure with reason
    await logEvent({
      eventType: AuditEventType.DEAL_ACCEPT_FAILED,
      entityType: AuditEntityType.OFFER,
      entityId: offerId,
      actorId: userId,
      targetId: orderId,
      metadata: { error: error.message },
      severity: AuditSeverity.WARN
    });
    
    if (error.message.includes('concurrent update') || error.message.includes('could not obtain lock')) {
      return { 
        success: false, 
        error: 'Ein anderer Nutzer hat diesen Auftrag bereits angenommen oder bearbeitet.' 
      };
    }
    
    return { success: false, error: error.message };
  }
  
  // Log successful acceptance
  await logEvent({
    eventType: AuditEventType.DEAL_ACCEPTED,
    entityType: AuditEntityType.OFFER,
    entityId: offerId,
    actorId: userId,
    targetId: orderId,
    metadata: { result: data },
    severity: AuditSeverity.INFO
  });
  
  return { success: true, data };
};

export const getOffersForOrder = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        driver:profiles!driver_id (
          user_id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { success: true, offers: data || [] };
  } catch (error) {
    console.error('Error fetching offers for order:', error);
    return { success: false, error: (error as Error).message, offers: [] };
  }
};

export const getCompetingOfferCount = async (orderId: string, excludeUserId?: string) => {
  try {
    let query = supabase
      .from('offers')
      .select('offer_id', { count: 'exact' })
      .eq('order_id', orderId)
      .eq('status', 'eingereicht');
      
    if (excludeUserId) {
      query = query.neq('driver_id', excludeUserId);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error counting competing offers:', error);
    return { success: false, error: (error as Error).message, count: 0 };
  }
};

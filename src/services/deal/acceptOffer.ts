
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';

/**
 * Accepts an offer for an order
 */
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

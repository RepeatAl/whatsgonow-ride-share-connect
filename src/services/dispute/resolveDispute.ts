
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { DisputeStatus, ResolutionParams } from './types';
import { handleForceMajeure } from './forceMajeure';

/**
 * Resolves an existing dispute
 */
export const resolveDispute = async (
  disputeId: string, 
  adminId: string,
  resolution: ResolutionParams
) => {
  const { logEvent } = useSystemAudit();
  
  try {
    // Get dispute details first
    const { data: dispute, error: fetchError } = await supabase
      .from('disputes')
      .select('*, orders(*)')
      .eq('id', disputeId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Update dispute status
    const { error } = await supabase
      .from('disputes')
      .update({
        status: resolution.status,
        resolved_by: adminId,
        resolved_at: new Date().toISOString(),
        resolution_notes: resolution.notes,
        resolution_actions: resolution.actions
      })
      .eq('id', disputeId);
      
    if (error) throw error;
    
    // Handle Force Majeure if applicable
    if (resolution.forceMajeure) {
      await handleForceMajeure({
        orderId: dispute.order_id, 
        adminId, 
        refundAmount: resolution.refundAmount,
        reason: `Force Majeure aus Dispute #${disputeId}: ${resolution.notes}`
      });
    } else {
      // Wenn nicht Force Majeure, dann Order-Status auf resolved setzen
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'resolved' })
        .eq('order_id', dispute.order_id);
        
      if (orderError) {
        console.error('Fehler beim Aktualisieren des Auftragsstatus:', orderError);
      }
    }
    
    // Log dispute resolution
    await logEvent({
      eventType: resolution.status === DisputeStatus.RESOLVED 
        ? AuditEventType.DISPUTE_RESOLVED 
        : AuditEventType.DISPUTE_ESCALATED,
      entityType: AuditEntityType.SUPPORT_TICKET,
      entityId: disputeId,
      actorId: adminId,
      targetId: dispute.order_id,
      metadata: { 
        resolution,
        forceMajeure: !!resolution.forceMajeure
      },
      severity: AuditSeverity.CRITICAL
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return { success: false, error: (error as Error).message };
  }
};

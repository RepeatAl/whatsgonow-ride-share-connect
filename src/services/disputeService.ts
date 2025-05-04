
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';

export enum DisputeReason {
  DELIVERY_ISSUE = 'delivery_issue',
  ITEM_DAMAGED = 'item_damaged',
  PAYMENT_ISSUE = 'payment_issue',
  QR_CODE_PROBLEM = 'qr_code_problem',
  OTHER = 'other'
}

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated'
}

export interface CreateDisputeParams {
  orderId: string;
  userId: string;
  reason: DisputeReason;
  description: string;
  evidenceUrls?: string[];
}

export const createDispute = async ({
  orderId,
  userId,
  reason,
  description,
  evidenceUrls = []
}: CreateDisputeParams) => {
  const { logEvent } = useSystemAudit();
  
  try {
    // Prüfen, ob bereits ein Dispute für diesen Auftrag existiert
    const { data: existingDispute, error: checkError } = await supabase
      .from('disputes')
      .select('id, status')
      .eq('order_id', orderId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // Wenn bereits ein offener Dispute existiert, nicht erneut anlegen
    if (existingDispute && ['open', 'under_review'].includes(existingDispute.status)) {
      return { 
        success: false, 
        error: 'Für diesen Auftrag existiert bereits ein offener Streitfall',
        existingDisputeId: existingDispute.id
      };
    }
    
    // Create dispute in database
    const { data, error } = await supabase
      .from('disputes')
      .insert({
        order_id: orderId,
        created_by: userId,
        reason,
        description,
        evidence_urls: evidenceUrls,
        status: DisputeStatus.OPEN
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Auftragsstatus auf "dispute" setzen
    const { error: orderError } = await supabase
      .from('orders')
      .update({ status: 'dispute' })
      .eq('order_id', orderId);
      
    if (orderError) {
      console.error('Fehler beim Aktualisieren des Auftragsstatus:', orderError);
    }
    
    // Log dispute creation
    await logEvent({
      eventType: AuditEventType.DISPUTE_OPENED,
      entityType: AuditEntityType.ORDER,
      entityId: orderId,
      actorId: userId,
      metadata: { 
        reason,
        description,
        disputeId: data.id
      },
      severity: AuditSeverity.CRITICAL,
      visibleTo: ['admin', 'super_admin', 'cm']
    });
    
    // Send notification to admins and CMs
    await supabase.functions.invoke('notify-dispute-created', {
      body: { disputeId: data.id, orderId, userId, reason }
    });
    
    return { success: true, data };
    
  } catch (error) {
    console.error('Error creating dispute:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const resolveDispute = async (
  disputeId: string, 
  adminId: string,
  resolution: {
    status: DisputeStatus.RESOLVED | DisputeStatus.ESCALATED;
    notes: string;
    actions: string[];
    forceMajeure?: boolean;
    refundAmount?: number;
  }
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
      await handleForceMajeure(
        dispute.order_id, 
        adminId, 
        resolution.refundAmount,
        `Force Majeure aus Dispute #${disputeId}: ${resolution.notes}`
      );
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

export const handleForceMajeure = async (
  orderId: string,
  adminId: string,
  refundAmount?: number,
  reason?: string
) => {
  const { logEvent } = useSystemAudit();
  
  try {
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();
      
    if (orderError) throw orderError;
    
    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'force_majeure_cancelled',
        force_majeure_data: {
          admin_id: adminId,
          timestamp: new Date().toISOString(),
          reason: reason || 'Force Majeure aktiviert',
          refund_amount: refundAmount
        }
      })
      .eq('order_id', orderId);
      
    if (updateError) throw updateError;
    
    // Handle refund if applicable
    if (refundAmount) {
      // Create refund transaction
      const { error: refundError } = await supabase
        .from('transactions')
        .insert({
          amount: refundAmount,
          payer_id: 'system', // System-initiated refund
          receiver_id: order.sender_id,
          order_id: orderId,
          type: 'refund',
          status: 'completed',
          metadata: {
            reason: 'force_majeure',
            authorized_by: adminId
          }
        });
        
      if (refundError) throw refundError;
    }
    
    // Log force majeure action
    await logEvent({
      eventType: AuditEventType.FORCE_MAJEURE_ACTIVATED,
      entityType: AuditEntityType.ORDER,
      entityId: orderId,
      actorId: adminId,
      metadata: { 
        reason: reason || 'Force Majeure aktiviert',
        refundAmount,
        originalStatus: order.status
      },
      severity: AuditSeverity.CRITICAL
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Error handling force majeure:', error);
    return { success: false, error: (error as Error).message };
  }
};

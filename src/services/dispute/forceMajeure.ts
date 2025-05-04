
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { ForceMatieureParams } from './types';

/**
 * Handles force majeure cases for orders
 */
export const handleForceMajeure = async ({
  orderId,
  adminId,
  refundAmount,
  reason
}: ForceMatieureParams) => {
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

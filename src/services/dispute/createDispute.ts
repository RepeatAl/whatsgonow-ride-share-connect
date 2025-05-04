
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { CreateDisputeParams, DisputeStatus } from './types';

/**
 * Creates a new dispute for an order
 */
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

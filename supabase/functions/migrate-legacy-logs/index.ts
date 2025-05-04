
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const logType = url.searchParams.get('type') || 'deal';
    const batchSize = parseInt(url.searchParams.get('batchSize') || '100', 10);
    const lastId = url.searchParams.get('lastId');
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Starting migration of ${logType} logs, batch size: ${batchSize}, lastId: ${lastId || 'none'}`);
    
    let query;
    
    switch (logType) {
      case 'deal':
        query = supabase
          .from('deal_logs')
          .select('*')
          .order('id', { ascending: true })
          .limit(batchSize);
          
        if (lastId) {
          query = query.gt('id', lastId);
        }
        break;
        
      case 'delivery':
        query = supabase
          .from('delivery_logs')
          .select('*')
          .order('log_id', { ascending: true })
          .limit(batchSize);
          
        if (lastId) {
          query = query.gt('log_id', lastId);
        }
        break;
        
      case 'invoice':
        query = supabase
          .from('invoice_audit_log')
          .select('*')
          .order('log_id', { ascending: true })
          .limit(batchSize);
          
        if (lastId) {
          query = query.gt('log_id', lastId);
        }
        break;
        
      default:
        throw new Error(`Unknown log type: ${logType}`);
    }
    
    const { data: logs, error } = await query;
    if (error) throw error;
    
    if (logs.length === 0) {
      return new Response(
        JSON.stringify({ success: true, migrated: 0, message: 'No more logs to migrate' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    console.log(`Found ${logs.length} ${logType} logs to migrate`);
    
    // Transform and migrate logs
    const systemLogs = logs.map(log => {
      switch (logType) {
        case 'deal':
          return {
            event_type: mapDealStatusToEventType(log.status),
            entity_type: 'deal',
            entity_id: log.order_id,
            actor_id: log.from_user_id,
            target_id: log.to_user_id,
            metadata: {
              original_id: log.id,
              proposed_price: log.proposed_price,
              source_table: 'deal_logs'
            },
            created_at: log.timestamp,
            severity: log.status === 'accepted' ? 'CRITICAL' : 'INFO',
            visible_to: ['admin', 'super_admin', 'cm']
          };
          
        case 'delivery':
          return {
            event_type: mapDeliveryActionToEventType(log.action),
            entity_type: 'order',
            entity_id: log.order_id,
            actor_id: log.user_id,
            metadata: {
              original_id: log.log_id,
              ip_address: log.ip_address,
              action: log.action,
              source_table: 'delivery_logs'
            },
            created_at: log.timestamp,
            severity: log.action.includes('scan') ? 'CRITICAL' : 'INFO',
            visible_to: ['admin', 'super_admin', 'cm']
          };
          
        case 'invoice':
          return {
            event_type: mapInvoiceActionToEventType(log.action),
            entity_type: 'invoice',
            entity_id: log.invoice_id,
            actor_id: log.user_id,
            metadata: {
              original_id: log.log_id,
              ip_address: log.ip_address,
              action: log.action,
              previous_state: log.previous_state,
              new_state: log.new_state,
              user_agent: log.user_agent,
              source_table: 'invoice_audit_log'
            },
            created_at: log.timestamp,
            severity: 'CRITICAL', // Invoice audit logs are always critical
            visible_to: ['admin', 'super_admin']
          };
      }
    });
    
    console.log(`Transformed ${systemLogs.length} logs for insertion`);
    
    // Insert transformed logs into system_logs
    const { error: insertError } = await supabase
      .from('system_logs')
      .insert(systemLogs);
      
    if (insertError) throw insertError;
    
    console.log(`Successfully migrated ${systemLogs.length} ${logType} logs`);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        migrated: logs.length, 
        lastId: logs[logs.length - 1].id || logs[logs.length - 1].log_id,
        logType,
        hasMore: logs.length === batchSize
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error migrating legacy logs:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Helper functions to map legacy log fields to new event types
function mapDealStatusToEventType(status: string): string {
  switch (status) {
    case 'proposed': return 'DEAL_PROPOSED';
    case 'counter': return 'DEAL_COUNTER_PROPOSED';
    case 'accepted': return 'DEAL_ACCEPTED';
    case 'expired': return 'DEAL_EXPIRED';
    default: return 'DEAL_ACTION';
  }
}

function mapDeliveryActionToEventType(action: string): string {
  if (action.includes('qr') && action.includes('scan')) {
    return 'QR_SCANNED';
  }
  if (action.includes('pickup')) {
    return 'DELIVERY_STARTED';
  }
  if (action.includes('deliver') || action.includes('drop')) {
    return 'DELIVERY_COMPLETED';
  }
  return 'DELIVERY_ACTION';
}

function mapInvoiceActionToEventType(action: string): string {
  if (action.includes('create')) {
    return 'INVOICE_CREATED';
  }
  if (action.includes('update')) {
    return 'INVOICE_UPDATED';
  }
  if (action.includes('sign')) {
    return 'INVOICE_SIGNED';
  }
  if (action.includes('send')) {
    return 'INVOICE_SENT';
  }
  if (action.includes('view')) {
    return 'INVOICE_VIEWED';
  }
  return 'INVOICE_ACTION';
}

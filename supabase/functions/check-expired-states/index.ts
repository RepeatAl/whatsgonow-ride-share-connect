
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
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Query orders with staging states
    const { data: orders, error } = await supabase
      .from('orders')
      .select('order_id, status, staging_state')
      .not('staging_state', 'is', null);
      
    if (error) throw error;
    
    console.log(`Found ${orders?.length || 0} orders with staging states to check`);
    
    const now = new Date();
    const processedOrders = [];
    
    // Process each order with staging state
    for (const order of orders) {
      const stagingState = order.staging_state;
      
      if (!stagingState || !stagingState.expires_at) {
        console.log(`Order ${order.order_id} has invalid staging state, skipping`);
        continue;
      }
      
      const expiresAt = new Date(stagingState.expires_at);
      
      if (now > expiresAt) {
        console.log(`Order ${order.order_id} staging state has expired (${expiresAt.toISOString()})`);
        
        // Update order status
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'expired',
            staging_state: null 
          })
          .eq('order_id', order.order_id);
          
        if (updateError) {
          console.error(`Error updating order ${order.order_id}:`, updateError);
          continue;
        }
          
        // Log to system_logs
        const { error: logError } = await supabase
          .from('system_logs')
          .insert({
            event_type: 'STAGING_STATE_EXPIRED',
            entity_type: 'order',
            entity_id: order.order_id,
            actor_id: 'system',
            metadata: { 
              previousStatus: order.status,
              stagingState: stagingState,
              expiredAt: expiresAt.toISOString()
            },
            severity: 'WARN'
          });
          
        if (logError) {
          console.error(`Error logging for order ${order.order_id}:`, logError);
        } else {
          processedOrders.push(order.order_id);
        }
      } else {
        console.log(`Order ${order.order_id} staging state still valid until ${expiresAt.toISOString()}`);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processedOrders.length, 
        orderIds: processedOrders,
        timestamp: now.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error processing expired staging states:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

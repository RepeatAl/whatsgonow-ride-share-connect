
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
    
    const now = new Date();
    let processedCount = 0;
    const processedIds = [];
    
    // 1. Überprüfen von Orders mit staging_state (Abwärtskompatibilität)
    const { data: stagingOrders, error: stagingError } = await supabase
      .from('orders')
      .select('order_id, status, staging_state')
      .not('staging_state', 'is', null);
      
    if (stagingError) throw new Error(`Fehler beim Abfragen von staging states: ${stagingError.message}`);
    
    console.log(`Gefunden: ${stagingOrders?.length || 0} Aufträge mit staging states`);
    
    // Verarbeite Orders mit staging_state
    for (const order of stagingOrders || []) {
      const stagingState = order.staging_state;
      
      if (!stagingState || !stagingState.expires_at) {
        console.log(`Auftrag ${order.order_id} hat ungültigen staging state, wird übersprungen`);
        continue;
      }
      
      const expiresAt = new Date(stagingState.expires_at);
      
      if (now > expiresAt) {
        console.log(`Auftrag ${order.order_id} staging state ist abgelaufen (${expiresAt.toISOString()})`);
        
        // Status aktualisieren
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'expired',
            staging_state: null 
          })
          .eq('order_id', order.order_id);
          
        if (updateError) {
          console.error(`Fehler beim Aktualisieren des Auftrags ${order.order_id}:`, updateError);
          continue;
        }
          
        // In system_logs protokollieren
        const { error: logError } = await supabase
          .from('system_logs')
          .insert({
            event_type: 'ORDER_EXPIRED',
            entity_type: 'order',
            entity_id: order.order_id,
            metadata: { 
              previousStatus: order.status,
              stagingState: stagingState,
              expiredAt: expiresAt.toISOString()
            },
            severity: 'WARN'
          });
          
        if (logError) {
          console.error(`Fehler beim Logging für Auftrag ${order.order_id}:`, logError);
        } else {
          processedCount++;
          processedIds.push(order.order_id);
        }
      } else {
        console.log(`Auftrag ${order.order_id} staging state ist noch gültig bis ${expiresAt.toISOString()}`);
      }
    }
    
    // 2. Überprüfen von Orders mit expires_at (neue Methode)
    const { data: expiringOrders, error: expiringError } = await supabase
      .from('orders')
      .select('order_id, status, expires_at')
      .eq('status', 'offer_pending')
      .lte('expires_at', now.toISOString())
      .is('staging_state', null); // Nur Orders ohne staging_state
      
    if (expiringError) throw new Error(`Fehler beim Abfragen von Ablaufzeiten: ${expiringError.message}`);
    
    console.log(`Gefunden: ${expiringOrders?.length || 0} abgelaufene offer_pending Aufträge`);
    
    // Verarbeite Orders mit expires_at
    for (const order of expiringOrders || []) {
      console.log(`Auftrag ${order.order_id} ist abgelaufen (${order.expires_at})`);
      
      // Status aktualisieren
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'expired'
        })
        .eq('order_id', order.order_id);
        
      if (updateError) {
        console.error(`Fehler beim Aktualisieren des Auftrags ${order.order_id}:`, updateError);
        continue;
      }
        
      // In system_logs protokollieren
      const { error: logError } = await supabase
        .from('system_logs')
        .insert({
          event_type: 'ORDER_EXPIRED',
          entity_type: 'order',
          entity_id: order.order_id,
          metadata: { 
            previousStatus: order.status,
            expiresAt: order.expires_at
          },
          severity: 'WARN'
        });
        
      if (logError) {
        console.error(`Fehler beim Logging für Auftrag ${order.order_id}:`, logError);
      } else {
        processedCount++;
        processedIds.push(order.order_id);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: processedCount, 
        orderIds: processedIds,
        timestamp: now.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Fehler beim Verarbeiten abgelaufener Status:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

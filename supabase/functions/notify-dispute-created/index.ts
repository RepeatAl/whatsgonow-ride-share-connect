
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
    // Parse request body
    const { disputeId, orderId, userId, reason } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Notifying about new dispute: ${disputeId} for order ${orderId}`);
    
    // Get dispute details
    const { data: dispute, error: disputeError } = await supabase
      .from('disputes')
      .select('*, orders(*)')
      .eq('id', disputeId)
      .single();
      
    if (disputeError) throw disputeError;
    
    // Get admin users and community managers to notify
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('user_id, email, role, region')
      .in('role', ['admin', 'super_admin', 'cm']);
      
    if (adminsError) throw adminsError;
    
    // Get order region
    const orderRegion = dispute?.orders?.region;
    
    // Filter CMs to only those in the order's region
    const notifyUsers = admins.filter(admin => 
      admin.role === 'admin' || 
      admin.role === 'super_admin' || 
      (admin.role === 'cm' && admin.region === orderRegion)
    );
    
    console.log(`Notifying ${notifyUsers.length} users about dispute`);
    
    // Format alert information
    const alertTitle = `⚠️ WICHTIG: Neuer Streitfall geöffnet`;
    const alertDescription = `Ein neuer Streitfall wurde für Auftrag ${orderId} geöffnet. Grund: ${formatReason(reason)}`;
    
    // Create notifications for each admin user
    const notifications = notifyUsers.map(user => ({
      user_id: user.user_id,
      title: alertTitle,
      description: alertDescription,
      event_type: 'DISPUTE_OPENED',
      entity_id: disputeId,
      related_entity_id: orderId,
      metadata: {
        reason,
        created_by: userId,
        region: orderRegion
      },
      is_read: false,
      priority: 'high',
      created_at: new Date().toISOString()
    }));
    
    // Save notifications to database
    if (notifications.length > 0) {
      const { error: notifyError } = await supabase
        .from('admin_notifications')
        .insert(notifications);
        
      if (notifyError) {
        console.error('Error creating admin notifications:', notifyError);
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        notifiedUsers: notifyUsers.length,
        disputeId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error notifying about dispute:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Helper function
function formatReason(reason: string): string {
  switch (reason) {
    case 'delivery_issue':
      return 'Problem mit der Lieferung';
    case 'item_damaged':
      return 'Artikel beschädigt';
    case 'payment_issue':
      return 'Zahlungsproblem';
    case 'qr_code_problem':
      return 'Problem mit QR-Code';
    default:
      return reason || 'Nicht angegeben';
  }
}

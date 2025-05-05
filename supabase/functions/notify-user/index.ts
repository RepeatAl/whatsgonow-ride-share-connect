
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  userId: string;
  userIds?: string[];
  eventType: string;
  entityId: string;
  title?: string;
  message: string;
  metadata?: Record<string, any>;
  priority?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const {
      userId,
      userIds,
      eventType,
      entityId,
      title,
      message,
      metadata = {},
      priority = 'medium'
    }: NotificationRequest = await req.json();
    
    console.log(`Creating notification of type ${eventType} for entity ${entityId}`);
    
    // Normalize the array of users to notify
    const usersToNotify: string[] = [];
    
    // Add single user if provided
    if (userId) {
      usersToNotify.push(userId);
    }
    
    // Add multiple users if provided
    if (userIds && Array.isArray(userIds)) {
      userIds.forEach(id => {
        if (!usersToNotify.includes(id)) {
          usersToNotify.push(id);
        }
      });
    }
    
    if (usersToNotify.length === 0) {
      throw new Error('No valid user IDs provided for notification');
    }
    
    // Create notifications for each user
    const notifications = usersToNotify.map(userId => ({
      user_id: userId,
      event_type: eventType,
      entity_id: entityId,
      title: title || getDefaultTitle(eventType),
      message,
      metadata,
      priority
    }));
    
    // Insert notifications into database
    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();
      
    if (error) {
      throw error;
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        notified: usersToNotify.length,
        notifications: data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error creating notifications:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error creating notification" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function getDefaultTitle(eventType: string): string {
  const titles: Record<string, string> = {
    'order_expiry_warning': 'Auftrag läuft bald ab',
    'order_expired': 'Auftrag abgelaufen',
    'order_status_changed': 'Auftragsstatus geändert',
    'deal_proposed': 'Neues Angebot erhalten',
    'deal_accepted': 'Angebot angenommen',
    'deal_rejected': 'Angebot abgelehnt',
    'deal_counter': 'Neues Gegenangebot',
    'dispute_opened': 'Neuer Streitfall eröffnet',
    'dispute_resolved': 'Streitfall gelöst',
    'payment_initiated': 'Zahlung eingeleitet',
    'payment_completed': 'Zahlung abgeschlossen',
    'payment_failed': 'Zahlung fehlgeschlagen',
    'system_announcement': 'Systemmitteilung'
  };
  
  return titles[eventType] || 'Neue Benachrichtigung';
}


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
    const { eventType, entityId, metadata, actorId, timestamp } = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Processing critical event notification: ${eventType} for ${entityId}`);
    
    // Get admin users to notify
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('user_id, email')
      .in('role', ['admin', 'super_admin']);
      
    if (adminsError) throw adminsError;
    
    // Format alert information
    const alertTitle = formatAlertTitle(eventType);
    const alertDescription = formatAlertDescription(eventType, entityId, metadata);
    
    // Create admin notifications for each admin user
    const notifications = admins.map(admin => ({
      user_id: admin.user_id,
      title: alertTitle,
      description: alertDescription,
      event_type: eventType,
      entity_id: entityId,
      metadata: metadata || {},
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
    
    // For super critical events, send an email
    if (isSuperCriticalEvent(eventType)) {
      await sendAlertEmails(admins, alertTitle, alertDescription, entityId);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        notifiedAdmins: admins.length,
        eventType,
        entityId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error sending critical event notification:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Helper functions
function formatAlertTitle(eventType: string): string {
  switch (eventType) {
    case 'FORCE_MAJEURE_ACTIVATED':
      return '⚠️ KRITISCH: Force Majeure aktiviert';
    case 'PAYMENT_FAILED':
      return '⚠️ KRITISCH: Zahlung fehlgeschlagen';
    case 'DISPUTE_OPENED':
      return '⚠️ WICHTIG: Neuer Streitfall geöffnet';
    case 'QR_BACKUP_USED':
      return '⚠️ WICHTIG: QR-Backup-Code verwendet';
    default:
      return `⚠️ Kritisches Ereignis: ${eventType}`;
  }
}

function formatAlertDescription(
  eventType: string, 
  entityId: string,
  metadata: any
): string {
  switch (eventType) {
    case 'FORCE_MAJEURE_ACTIVATED':
      return `Force Majeure wurde für Auftrag ${entityId} aktiviert. Grund: ${metadata?.reason || 'Nicht angegeben'}`;
    case 'PAYMENT_FAILED':
      return `Zahlungsfehler bei Auftrag ${entityId}. Details: ${metadata?.errorMessage || 'Keine Details verfügbar'}`;
    case 'DISPUTE_OPENED':
      return `Ein neuer Streitfall wurde für Auftrag ${entityId} geöffnet. Grund: ${metadata?.reason || 'Nicht angegeben'}`;
    case 'QR_BACKUP_USED':
      return `Backup-Code wurde bei einer Lieferung verwendet. Auftrag: ${entityId}. Gerät: ${metadata?.deviceInfo || 'Unbekannt'}`;
    default:
      return `Ein kritisches Ereignis vom Typ ${eventType} ist aufgetreten. Auftrag: ${entityId}`;
  }
}

function isSuperCriticalEvent(eventType: string): boolean {
  return [
    'FORCE_MAJEURE_ACTIVATED',
    'PAYMENT_FAILED',
    'UNUSUAL_ACCESS_PATTERN'
  ].includes(eventType);
}

async function sendAlertEmails(
  admins: any[], 
  subject: string, 
  body: string,
  entityId: string
) {
  try {
    // In a production environment we would use a service like Resend or SendGrid
    // For now we'll just log that we would send emails
    console.log(`Would send email with subject "${subject}" to ${admins.length} admins for entity ${entityId}`);
    
    // Example of how this might look with a real email service:
    /*
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Missing RESEND_API_KEY');
    }
    
    const resend = new Resend(resendApiKey);
    
    for (const admin of admins) {
      if (!admin.email) continue;
      
      await resend.emails.send({
        from: 'alerts@whatsgonow.com',
        to: admin.email,
        subject: subject,
        html: `<p>${body}</p>
               <p><a href="https://app.whatsgonow.com/entity/${entityId}">Details ansehen</a></p>`
      });
    }
    */
  } catch (error) {
    console.error('Error sending alert emails:', error);
  }
}

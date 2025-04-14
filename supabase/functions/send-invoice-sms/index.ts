
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { randomUUID } from "https://deno.land/std@0.190.0/uuid/mod.ts";

// Twilio API
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceSMSRequest {
  invoiceId: string;
  recipientPhone: string;
  includePin?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      invoiceId, 
      recipientPhone, 
      includePin = false 
    }: InvoiceSMSRequest = await req.json();

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate secure token
    const token = randomUUID();
    const pin = includePin 
      ? Math.floor(1000 + Math.random() * 9000).toString() 
      : null;

    // Create signed URL for invoice
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('invoices')
      .createSignedUrl(`${invoiceId}/invoice.pdf`, 3600); // 1-hour expiry

    if (storageError || !storageData) {
      throw new Error('Failed to generate signed invoice URL');
    }

    // Insert token record
    const { error: tokenError } = await supabase
      .from('invoice_sms_tokens')
      .insert({
        invoice_id: invoiceId,
        token: token,
        recipient_phone: recipientPhone,
        pin: pin,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
      });

    if (tokenError) {
      throw new Error('Failed to create SMS token');
    }

    // Construct secure download link
    const downloadLink = `https://app.whatsgonow.com/invoice-download/${token}`;

    // Send SMS via Twilio
    const smsBody = pin
      ? `Ihre Rechnung ist verfügbar. Link: ${downloadLink}. PIN: ${pin}`
      : `Ihre Rechnung ist verfügbar. Link: ${downloadLink} (gültig 48h)`;

    const smsResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'From': twilioPhoneNumber,
          'To': recipientPhone,
          'Body': smsBody
        })
      }
    );

    const smsResult = await smsResponse.json();
    console.log('SMS sent:', smsResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        token: token, 
        downloadLink: downloadLink 
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error('Error in send-invoice-sms function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        }
      }
    );
  }
};

serve(handler);

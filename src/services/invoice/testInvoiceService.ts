
import { detailedInvoiceService } from './detailedInvoiceService';
import { emailService } from './emailService';
import { supabase } from '@/lib/supabaseClient'; // Added this import

export const testInvoiceService = {
  createTestInvoice: async () => {
    const testInvoiceData = {
      sender_id: 'test-sender',
      amount: 42.99,
      currency: 'EUR',
      senderAddress: {
        company_name: 'Test GmbH',
        street: 'Teststraße',
        building_number: '123',
        postal_code: '12345',
        city: 'Berlin',
        country: 'DE',
        entity_type: 'sender'
      },
      recipientAddress: {
        company_name: 'Empfänger AG',
        street: 'Empfängerweg',
        building_number: '456',
        postal_code: '54321',
        city: 'München',
        country: 'DE',
        entity_type: 'recipient'
      },
      lineItems: [
        {
          description: 'Test Lieferung',
          quantity: 1,
          unit_price: 42.99,
          unit_of_measure: 'Stück',
          total_price: 42.99
        }
      ]
    };

    return await detailedInvoiceService.createDetailedInvoice(testInvoiceData);
  },

  getLatestToken: async (invoiceId: string) => {
    const { data: tokenData } = await supabase
      .from('invoice_sms_tokens')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    return tokenData;
  }
};

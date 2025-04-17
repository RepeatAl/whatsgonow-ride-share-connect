
import { supabase } from "@/lib/supabaseClient";
import { TestResult } from "./types";

/**
 * Helper function to test inserting an order
 */
export const testInsertOrder = async (): Promise<TestResult> => {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      description: 'RLS Test Order',
      from_address: 'Test From Address',
      to_address: 'Test To Address',
      weight: 5,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: 'offen'
    })
    .select();
  
  console.log(`INSERT ORDER test: ${error ? 'DENIED' : 'ALLOWED'}`);
  
  return {
    success: !error,
    data: data ? data[0] : null,
    error: error ? error.message : null
  };
};

/**
 * Helper function to test inserting an offer
 */
export const testInsertOffer = async (): Promise<TestResult> => {
  // First get an open order
  const { data: orders } = await supabase
    .from('orders')
    .select('order_id')
    .eq('status', 'offen')
    .limit(1);
  
  if (!orders || orders.length === 0) {
    return {
      success: false,
      error: 'No open orders available for testing offer'
    };
  }
  
  const { data, error } = await supabase
    .from('offers')
    .insert({
      order_id: orders[0].order_id,
      price: 50,
      status: 'eingereicht'
    })
    .select();
  
  console.log(`INSERT OFFER test: ${error ? 'DENIED' : 'ALLOWED'}`);
  
  return {
    success: !error,
    data: data ? data[0] : null,
    error: error ? error.message : null
  };
};

/**
 * Helper function to test inserting a rating
 */
export const testInsertRating = async (): Promise<TestResult> => {
  // This is complex since ratings can only be inserted for completed orders
  // Simplified test just checks if the operation is denied due to RLS
  const { data, error } = await supabase
    .from('ratings')
    .insert({
      score: 5,
      comment: 'RLS Test Rating',
      // These will likely fail but we're testing RLS enforcement
      from_user: 'user_id_placeholder',
      to_user: 'user_id_placeholder',
      order_id: 'order_id_placeholder'
    })
    .select();
  
  console.log(`INSERT RATING test: ${error ? 'DENIED' : 'ALLOWED'}`);
  
  return {
    success: !error,
    data: data ? data[0] : null,
    error: error ? error.message : null
  };
};

/**
 * Helper function to test updating an order
 */
export const testUpdateOrder = async (): Promise<TestResult> => {
  // In a real test, we would need an order that the driver has accepted
  // Simplified test just checks if the operation is denied due to RLS
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'unterwegs' })
    .eq('order_id', 'placeholder_id')
    .select();
  
  console.log(`UPDATE ORDER test: ${error ? 'DENIED' : 'ALLOWED'}`);
  
  return {
    success: !error,
    data: data ? data[0] : null,
    error: error ? error.message : null
  };
};

/**
 * Helper function to test updating an offer
 */
export const testUpdateOffer = async (): Promise<TestResult> => {
  // In a real test, we would need an offer for the sender's order
  // Simplified test just checks if the operation is denied due to RLS
  const { data, error } = await supabase
    .from('offers')
    .update({ status: 'angenommen' })
    .eq('offer_id', 'placeholder_id')
    .select();
  
  console.log(`UPDATE OFFER test: ${error ? 'DENIED' : 'ALLOWED'}`);
  
  return {
    success: !error,
    data: data ? data[0] : null,
    error: error ? error.message : null
  };
};

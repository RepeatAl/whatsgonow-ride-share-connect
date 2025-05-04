
import { supabase } from "@/lib/supabaseClient";
import { UserRole, testUsers, RoleResults, tableTests, TestResult } from "./types";
import { testInsertOrder, testInsertOffer, testInsertRating, testUpdateOrder, testUpdateOffer } from "./test-operations";

/**
 * Tests table access for a specific user role
 * This file follows the conventions from /docs/conventions/roles_and_ids.md
 */
export const testRoleAccess = async (role: UserRole): Promise<RoleResults> => {
  const results: RoleResults = {};
  const testUser = testUsers[role];
  
  try {
    // Sign in as the test user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });
    
    if (signInError) {
      console.error(`Error signing in as ${role}:`, signInError);
      const errorResult: RoleResults = {};
      errorResult["auth_error"] = {
        success: false,
        error: `Failed to sign in as ${role}: ${signInError.message}`
      };
      return errorResult;
    }
    
    console.log(`Successfully signed in as ${role}`);
    
    // Test access to each table
    for (const { table, operations } of tableTests) {
      results[table] = {};
      
      // Test SELECT
      if (operations.includes('SELECT')) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(5);
        
        (results[table] as any).SELECT = {
          success: !error,
          count: data?.length || 0,
          error: error ? error.message : null
        };
        
        console.log(`${role} SELECT on ${table}: ${error ? 'DENIED' : 'ALLOWED'} (${data?.length || 0} rows)`);
      }
      
      // Test INSERT (for applicable tables and roles)
      if (operations.includes('INSERT')) {
        let insertResult;
        switch (table) {
          case 'orders':
            if (role === 'sender_private' || role === 'sender_business') {
              insertResult = await testInsertOrder();
            }
            break;
          case 'offers':
            if (role === 'driver') {
              insertResult = await testInsertOffer();
            }
            break;
          case 'ratings':
            insertResult = await testInsertRating();
            break;
          case 'role_change_logs':
            if (role === 'super_admin') {
              // Super admin should be able to add role changes
              const { data, error } = await supabase
                .from('role_change_logs')
                .insert({
                  changed_by: testUser.user_id,
                  target_user: testUser.user_id, // Using self as target just for testing
                  old_role: 'sender_private',
                  new_role: 'driver'
                })
                .select();
                
              insertResult = {
                success: !error,
                data: data ? data[0] : null,
                error: error ? error.message : null
              };
            }
            break;
        }
        
        if (insertResult) {
          (results[table] as any).INSERT = insertResult;
        }
      }
      
      // Test UPDATE (for applicable tables and roles)
      if (operations.includes('UPDATE')) {
        let updateResult;
        switch (table) {
          case 'orders':
            if (role === 'driver') {
              updateResult = await testUpdateOrder();
            }
            break;
          case 'offers':
            if (role === 'sender_private' || role === 'sender_business') {
              updateResult = await testUpdateOffer();
            }
            break;
        }
        
        if (updateResult) {
          (results[table] as any).UPDATE = updateResult;
        }
      }
    }
    
    // Special test for region filtering (for CM role)
    if (role === 'cm') {
      await testRegionFiltering(results, testUser.region!);
    }
    
    return results;
  } catch (error) {
    console.error(`Error testing ${role} access:`, error);
    const errorResult: RoleResults = {};
    errorResult["testing_error"] = {
      success: false,
      error: `Test failed for ${role}: ${(error as Error).message}`
    };
    return errorResult;
  }
};

/**
 * Tests CM region filtering
 */
async function testRegionFiltering(results: RoleResults, region: string) {
  console.log(`Testing region filtering for CM in region: ${region}`);
  
  // Test profiles in region - CM should be able to see profiles in their region
  const { data: profilesInRegion, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('region', region);
  
  results["regionFiltering_profiles"] = {
    success: !profilesError,
    count: profilesInRegion?.length || 0,
    error: profilesError ? profilesError.message : null,
    details: `CM can access profiles in their region (${region})`
  };
  
  // Test orders in region - CM should be able to see orders in their region
  const { data: ordersInRegion, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('region', region)
    .limit(10);
  
  results["regionFiltering_orders"] = {
    success: !ordersError,
    count: ordersInRegion?.length || 0,
    error: ordersError ? ordersError.message : null,
    details: `CM can access orders in their region (${region})`
  };
  
  // Test profiles outside region - CM should NOT be able to see profiles outside their region
  const { data: profilesOutside, error: profilesOutsideError } = await supabase
    .from('profiles')
    .select('count')
    .neq('region', region)
    .single();
  
  const outsideCount = profilesOutside?.count || 0;
  
  results["regionFiltering_profiles_outside"] = {
    success: outsideCount === 0, // Success if no access to profiles outside region
    count: outsideCount,
    error: profilesOutsideError ? profilesOutsideError.message : null,
    details: `CM cannot access profiles outside their region`
  };
  
  console.log(`CM region filtering test results: 
    - Profiles in region: ${profilesInRegion?.length || 0}
    - Orders in region: ${ordersInRegion?.length || 0}
    - Access to profiles outside region: ${outsideCount === 0 ? 'BLOCKED' : 'ALLOWED'}`);
}


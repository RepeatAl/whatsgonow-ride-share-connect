
import { supabase } from "@/lib/supabaseClient";
import { UserRole, testUsers, RoleResults, tableTests } from "./types";
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
  // Test users in region
  const { data: usersInRegion, error: regionError } = await supabase
    .from('users')
    .select('*')
    .eq('region', region);
  
  results["regionFiltering"] = {
    success: !regionError,
    count: usersInRegion?.length || 0,
    error: regionError ? regionError.message : null
  };
  
  // Test users not in region (should get empty result)
  const { data: usersNotInRegion, error: notRegionError } = await supabase
    .from('users')
    .select('*')
    .neq('region', region);
  
  results["regionFiltering_negative"] = {
    success: (usersNotInRegion?.length || 0) === 0, // Success if empty result
    count: usersNotInRegion?.length || 0,
    error: notRegionError ? notRegionError.message : null
  };
  
  console.log(`CM region filtering test: ${regionError ? 'FAILED' : 'PASSED'} (${usersInRegion?.length || 0} users in region)`);
}

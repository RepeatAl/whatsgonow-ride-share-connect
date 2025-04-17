
import { supabase } from "@/lib/supabaseClient";
import { UserRole, testUsers, RoleResults, tableTests } from "./types";
import { testInsertOrder, testInsertOffer, testInsertRating, testUpdateOrder, testUpdateOffer } from "./test-operations";

/**
 * Tests table access for a specific user role
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
      return {
        error: `Failed to sign in as ${role}: ${signInError.message}`
      };
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
            if (role === 'sender') {
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
            if (role === 'sender') {
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
      const { data: usersInRegion, error: regionError } = await supabase
        .from('users')
        .select('*')
        .eq('region', testUser.region!);
      
      results.regionFiltering = {
        success: !regionError,
        count: usersInRegion?.length || 0,
        error: regionError ? regionError.message : null
      };
      
      console.log(`CM region filtering test: ${regionError ? 'FAILED' : 'PASSED'} (${usersInRegion?.length || 0} users in region)`);
    }
    
    return results;
  } catch (error) {
    console.error(`Error testing ${role} access:`, error);
    return {
      error: `Test failed for ${role}: ${(error as Error).message}`
    };
  }
};

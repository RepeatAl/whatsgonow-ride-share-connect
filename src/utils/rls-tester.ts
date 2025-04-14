
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

type UserRole = 'driver' | 'sender' | 'cm' | 'admin';

interface TestUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  region?: string;
  user_id?: string;
}

// Test users for different roles
const testUsers: Record<UserRole, TestUser> = {
  driver: {
    email: "test-driver@whatsgonow.de",
    password: "testdriver123",
    name: "Test Fahrer",
    role: "driver",
    region: "Berlin"
  },
  sender: {
    email: "test-sender@whatsgonow.de",
    password: "testsender123",
    name: "Test Auftraggeber",
    role: "sender",
    region: "Berlin"
  },
  cm: {
    email: "test-cm@whatsgonow.de",
    password: "testcm123",
    name: "Test Community Manager",
    role: "cm",
    region: "Berlin"
  },
  admin: {
    email: "test-admin@whatsgonow.de",
    password: "testadmin123",
    name: "Test Admin",
    role: "admin"
  }
};

// Table access tests to run
const tableTests = [
  { table: 'users', operations: ['SELECT'] },
  { table: 'orders', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'offers', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'transactions', operations: ['SELECT'] },
  { table: 'ratings', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'delivery_logs', operations: ['SELECT'] },
  { table: 'community_managers', operations: ['SELECT'] }
];

/**
 * Creates test users in the database
 */
const createTestUsers = async (): Promise<boolean> => {
  try {
    // First, check if test users already exist
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('user_id, email, role')
      .in('email', Object.values(testUsers).map(user => user.email));
    
    if (checkError) {
      console.error("Error checking for existing test users:", checkError);
      return false;
    }
    
    // Map existing users by email
    const existingUserMap = existingUsers?.reduce((acc, user) => {
      acc[user.email] = user;
      return acc;
    }, {} as Record<string, any>) || {};
    
    // Create any missing test users
    for (const role of Object.keys(testUsers) as UserRole[]) {
      const testUser = testUsers[role];
      
      if (existingUserMap[testUser.email]) {
        console.log(`Test user ${testUser.email} already exists with ID ${existingUserMap[testUser.email].user_id}`);
        testUsers[role].user_id = existingUserMap[testUser.email].user_id;
        continue;
      }
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password
      });
      
      if (authError) {
        console.error(`Error creating auth user for ${role}:`, authError);
        continue;
      }
      
      const userId = authData.user?.id;
      if (!userId) {
        console.error(`No user ID returned for ${role}`);
        continue;
      }
      
      // Create user record
      const { error: userError } = await supabase.from('users').insert({
        user_id: userId,
        name: testUser.name,
        email: testUser.email,
        role: testUser.role,
        region: testUser.region
      });
      
      if (userError) {
        console.error(`Error creating user record for ${role}:`, userError);
        continue;
      }
      
      // For CM role, also create community_managers record
      if (role === 'cm') {
        const { error: cmError } = await supabase.from('community_managers').insert({
          user_id: userId,
          region: testUser.region!,
          commission_rate: 5.0
        });
        
        if (cmError) {
          console.error("Error creating community manager record:", cmError);
        }
      }
      
      testUsers[role].user_id = userId;
      console.log(`Created test user for role ${role} with ID ${userId}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in createTestUsers:", error);
    return false;
  }
};

/**
 * Tests table access for a specific user role
 */
const testRoleAccess = async (role: UserRole): Promise<Record<string, any>> => {
  const results: Record<string, any> = {};
  const testUser = testUsers[role];
  
  try {
    // Sign in as the test user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });
    
    if (signInError) {
      console.error(`Error signing in as ${role}:`, signInError);
      return { error: `Failed to sign in as ${role}: ${signInError.message}` };
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
        
        results[table].SELECT = {
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
          results[table].INSERT = insertResult;
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
          results[table].UPDATE = updateResult;
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
    return { error: `Test failed for ${role}: ${(error as Error).message}` };
  }
};

/**
 * Helper function to test inserting an order
 */
const testInsertOrder = async () => {
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
const testInsertOffer = async () => {
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
const testInsertRating = async () => {
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
const testUpdateOrder = async () => {
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
const testUpdateOffer = async () => {
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

/**
 * Runs all RLS tests and returns the results
 */
export const runRLSTests = async (): Promise<Record<string, any>> => {
  const results: Record<string, any> = {};
  
  try {
    // Create test users if needed
    const usersCreated = await createTestUsers();
    if (!usersCreated) {
      return { error: "Failed to create or verify test users" };
    }
    
    // Test each role
    for (const role of Object.keys(testUsers) as UserRole[]) {
      toast({
        title: `Testing RLS for ${role} role`,
        description: "Verifying database access permissions...",
      });
      
      results[role] = await testRoleAccess(role);
      
      console.log(`Completed RLS tests for ${role}:`, results[role]);
    }
    
    // Sign out after all tests
    await supabase.auth.signOut();
    
    // Show completion message
    toast({
      title: "RLS Testing Completed",
      description: "All role-based access tests have been executed. Check console for details.",
    });
    
    return results;
  } catch (error) {
    console.error("Error running RLS tests:", error);
    toast({
      title: "RLS Testing Failed",
      description: `An error occurred: ${(error as Error).message}`,
      variant: "destructive"
    });
    
    return { error: (error as Error).message };
  }
};

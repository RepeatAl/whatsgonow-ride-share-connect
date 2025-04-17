
import { supabase } from "@/lib/supabaseClient";
import { TestUser, UserRole, testUsers } from "./types";

/**
 * Creates test users in the database
 */
export const createTestUsers = async (): Promise<boolean> => {
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

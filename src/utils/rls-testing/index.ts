
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";
import { UserRole, testUsers, AllResults } from "./types";
import { createTestUsers } from "./test-user-manager";
import { testRoleAccess } from "./role-access-tester";

/**
 * Runs all RLS tests and returns the results
 */
export const runRLSTests = async (): Promise<AllResults> => {
  const results: AllResults = {};
  
  try {
    // Create test users if needed
    const usersCreated = await createTestUsers();
    if (!usersCreated) {
      return { error: "Failed to create or verify test users" } as AllResults;
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
    
    return { error: (error as Error).message } as AllResults;
  }
};

// Re-export everything for backward compatibility
export * from "./types";
export * from "./test-user-manager";
export * from "./test-operations";
export * from "./role-access-tester";

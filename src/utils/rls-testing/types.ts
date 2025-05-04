
import { supabase } from "@/lib/supabaseClient";

// Define the user roles 
export type UserRole = 'driver' | 'sender' | 'cm' | 'admin' | 'super_admin';

// Define test user interface
export interface TestUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  region?: string;
  user_id?: string;
}

// Define structure for table tests
export interface TableTest {
  table: string;
  operations: Array<'SELECT' | 'INSERT' | 'UPDATE'>;
}

// Define results structure
export interface TestResult {
  success: boolean;
  count?: number;
  data?: any;
  error: string | null;
}

export interface TableResults {
  [operation: string]: TestResult;
}

// Role results interface that supports error messages
export interface RoleResults {
  [key: string]: TestResult | TableResults;
}

// Modified AllResults interface to correctly handle error cases
export interface AllResults {
  [key: string]: RoleResults | string;
  error?: string;
}

// Test users for different roles
export const testUsers: Record<UserRole, TestUser> = {
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
  },
  super_admin: {
    email: "test-superadmin@whatsgonow.de",
    password: "testsuperadmin123",
    name: "Test Super Admin",
    role: "super_admin"
  }
};

// Table access tests to run
export const tableTests: TableTest[] = [
  { table: 'users', operations: ['SELECT'] },
  { table: 'orders', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'offers', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'transactions', operations: ['SELECT'] },
  { table: 'ratings', operations: ['SELECT', 'INSERT', 'UPDATE'] },
  { table: 'delivery_logs', operations: ['SELECT'] },
  { table: 'community_managers', operations: ['SELECT'] }
];

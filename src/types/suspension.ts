
import { Profile } from "@/types/auth"; // Changed import path to use auth instead of ./profile

export type SuspensionType = 'hard' | 'temporary' | 'soft';

export interface UserSuspension {
  id: string;
  user_id: string;
  suspended_at: string;
  suspended_by: string;
  reason: string;
  duration: string | null; // PostgreSQL interval as string
  suspension_type: SuspensionType;
  unblocked_at: string | null;
  unblocked_by: string | null;
  notes: string | null;
  metadata?: Record<string, any>;
}

export interface SuspendedUserInfo {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  suspended_at: string;
  suspended_by: string;
  suspended_by_name: string;
  reason: string;
  suspension_type: SuspensionType;
  suspended_until: string | null;
  is_active: boolean;
}

export interface SuspendUserOptions {
  user_id: string;
  reason: string;
  duration?: string | null; // PostgreSQL interval as string
  suspension_type?: SuspensionType;
}

export interface SuspensionStatus {
  is_suspended: boolean;
  suspended_until: string | null;
  suspension_reason: string | null;
}

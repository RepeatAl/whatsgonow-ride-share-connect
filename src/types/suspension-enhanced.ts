
import { UserProfile } from "@/types/auth";

export type SuspensionType = 'hard' | 'temporary' | 'soft' | 'permanent';

export interface EnhancedUserSuspension {
  id: string;
  user_id: string;
  suspended_by: string;
  reason: string;
  reason_code?: string; // For i18n support
  suspension_type: SuspensionType;
  suspended_at: string;
  suspended_until: string | null;
  reactivated_at: string | null;
  reactivated_by: string | null;
  reactivation_notes: string | null;
  status: 'active' | 'expired' | 'revoked';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EnhancedSuspendedUserInfo {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  suspension_type: SuspensionType;
  reason: string;
  reason_code?: string;
  suspended_at: string;
  suspended_until: string | null;
  suspended_by_name: string;
  is_active: boolean;
  is_currently_suspended: boolean;
}

export interface SuspendUserOptionsEnhanced {
  user_id: string;
  reason: string;
  reason_code?: string; // For i18n
  duration?: string | null;
  suspension_type?: SuspensionType;
  audit_notes?: string;
}

export interface SuspensionStatusEnhanced {
  is_suspended: boolean;
  suspended_until: string | null;
  suspension_reason: string | null;
  reason_code?: string;
  isCurrentlySuspended: boolean;
}

// Reason codes for i18n support
export const SUSPENSION_REASON_CODES = {
  SPAM: 'suspension.reason.spam',
  ABUSE: 'suspension.reason.abuse', 
  FRAUD: 'suspension.reason.fraud',
  TOS_VIOLATION: 'suspension.reason.tos_violation',
  TRUST_SCORE_LOW: 'suspension.reason.trust_score_low',
  MULTIPLE_FLAGS: 'suspension.reason.multiple_flags',
  MANUAL_REVIEW: 'suspension.reason.manual_review',
  OTHER: 'suspension.reason.other'
} as const;

export type SuspensionReasonCode = keyof typeof SUSPENSION_REASON_CODES;

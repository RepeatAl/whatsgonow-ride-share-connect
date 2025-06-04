
export interface SuspensionStatus {
  is_suspended: boolean;
  suspended_until: string | null;
  suspension_reason: string | null;
}

export type SuspensionType = 'hard' | 'soft' | 'temporary' | 'permanent';

export type SuspensionReasonCode = 
  | 'SPAM'
  | 'ABUSE' 
  | 'FRAUD'
  | 'TOS_VIOLATION'
  | 'TRUST_SCORE_LOW'
  | 'MULTIPLE_FLAGS'
  | 'MANUAL_REVIEW'
  | 'OTHER';

export interface UserSuspension {
  id: string;
  user_id: string;
  suspended_by: string;
  suspension_reason: string;
  reason: string;
  suspended_at: string;
  suspended_until: string | null;
  duration: string | null;
  suspension_type: SuspensionType;
  is_active: boolean;
  unblocked_at?: string | null;
  notes?: string;
}

export interface SuspendedUserInfo {
  user_id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  suspended_at: string;
  suspended_until: string | null;
  suspension_reason: string;
  reason: string;
  suspended_by: string;
  suspended_by_name: string;
  suspension_type: SuspensionType;
  is_active: boolean;
}

export interface SuspendUserOptions {
  user_id: string;
  duration?: string;
  reason: string;
  suspension_type: SuspensionType;
  notify_user?: boolean;
}

export interface EnhancedSuspendUserOptions {
  user_id: string;
  reason: string;
  reasonCode: SuspensionReasonCode;
  suspension_type: SuspensionType;
  duration?: string | null;
  auditNotes?: string;
}

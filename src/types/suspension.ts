
export interface SuspensionStatus {
  is_suspended: boolean;
  suspended_until: string | null;
  suspension_reason: string | null;
}

export interface UserSuspension {
  id: string;
  user_id: string;
  suspended_by: string;
  suspension_reason: string;
  suspended_at: string;
  suspended_until: string | null;
  is_active: boolean;
}

export interface SuspendedUserInfo {
  user_id: string;
  name: string;
  email: string;
  suspended_at: string;
  suspended_until: string | null;
  suspension_reason: string;
  suspended_by: string;
}

export interface SuspendUserOptions {
  duration_hours?: number;
  reason: string;
  notify_user?: boolean;
}

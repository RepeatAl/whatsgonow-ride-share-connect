
export type SuspensionType = 'temporary' | 'permanent' | 'soft' | 'hard';

export type SuspensionReasonCode = 
  | 'SPAM'
  | 'ABUSE' 
  | 'FRAUD'
  | 'TOS_VIOLATION'
  | 'TRUST_SCORE_LOW'
  | 'MULTIPLE_FLAGS'
  | 'MANUAL_REVIEW'
  | 'OTHER';

export const SUSPENSION_REASON_CODES: Record<SuspensionReasonCode, string> = {
  SPAM: 'Spam-Verhalten',
  ABUSE: 'Missbrauch der Plattform',
  FRAUD: 'Betrügerische Aktivität',
  TOS_VIOLATION: 'Verstoß gegen AGB',
  TRUST_SCORE_LOW: 'Niedriger Trust Score',
  MULTIPLE_FLAGS: 'Mehrfache Meldungen',
  MANUAL_REVIEW: 'Manuelle Überprüfung',
  OTHER: 'Sonstiger Grund'
};

export interface EnhancedSuspendUserOptions {
  user_id: string;
  reason: string;
  reasonCode: SuspensionReasonCode;
  suspension_type: SuspensionType;
  duration?: string | null;
  auditNotes?: string;
}

export interface SuspensionAuditEntry {
  id: string;
  user_id: string;
  action: 'suspended' | 'unsuspended' | 'modified';
  reason: string;
  reason_code: SuspensionReasonCode;
  suspension_type: SuspensionType;
  duration: string | null;
  suspended_by: string;
  suspended_by_name: string;
  audit_notes: string | null;
  created_at: string;
  metadata?: Record<string, any>;
}

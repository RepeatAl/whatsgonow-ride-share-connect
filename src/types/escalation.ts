
export interface EscalationStatus {
  hasActiveEscalation: boolean;
  isPreSuspended: boolean;
  preSuspendReason: string | null;
  preSuspendAt: string | null;
}

export interface Escalation {
  id: string;
  user_id: string;
  user_name: string;
  trigger_reason: string;
  escalation_type: string;
  triggered_at: string;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface EscalationFilter {
  status?: 'pending' | 'resolved' | 'all' | 'active';
  type?: string;
  escalation_type?: string;
  date_from?: string;
  date_to?: string;
}

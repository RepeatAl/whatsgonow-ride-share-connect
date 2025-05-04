
import { AuditEntityType, AuditEventType, AuditSeverity } from '@/constants/auditEvents';

export enum DisputeReason {
  DELIVERY_ISSUE = 'delivery_issue',
  ITEM_DAMAGED = 'item_damaged',
  PAYMENT_ISSUE = 'payment_issue',
  QR_CODE_PROBLEM = 'qr_code_problem',
  OTHER = 'other'
}

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated'
}

export interface CreateDisputeParams {
  orderId: string;
  userId: string;
  reason: DisputeReason;
  description: string;
  evidenceUrls?: string[];
}

export interface ResolutionParams {
  status: DisputeStatus.RESOLVED | DisputeStatus.ESCALATED;
  notes: string;
  actions: string[];
  forceMajeure?: boolean;
  refundAmount?: number;
}

export interface ForceMatieureParams {
  orderId: string;
  adminId: string;
  refundAmount?: number;
  reason?: string;
}

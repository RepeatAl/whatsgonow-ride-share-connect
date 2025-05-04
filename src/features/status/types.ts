
/**
 * Status-Enums für verschiedene Entitätstypen im System.
 * Zentrale Definition aller Status-Werte für Orders, Deals und Disputes.
 */

/**
 * Auftrags-Status (Order)
 */
export enum OrderStatus {
  CREATED = 'created',
  OFFER_PENDING = 'offer_pending',
  DEAL_ACCEPTED = 'deal_accepted',
  CONFIRMED_BY_SENDER = 'confirmed_by_sender',
  IN_DELIVERY = 'in_delivery',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  DISPUTE = 'dispute',
  FORCE_MAJEURE_CANCELLED = 'force_majeure_cancelled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  RESOLVED = 'resolved'
}

/**
 * Angebots-Status (Deal)
 */
export enum DealStatus {
  PROPOSED = 'proposed',
  COUNTER = 'counter',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

/**
 * Streitfall-Status (Dispute)
 */
export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved'
}

/**
 * Entitäts-Typ-Definition.
 */
export type EntityType = 'order' | 'deal' | 'dispute';

/**
 * Typ für Status-Übergangsmap.
 */
export type StatusTransitionMap = {
  [key: string]: string[];
};

/**
 * Re-export der Konstanten aus dem zentralen Modul
 * für Abwärtskompatibilität
 */
export { VALID_TRANSITIONS, STATUS_PERMISSIONS, STATUS_LABELS } from '@/constants/statusTransitions';

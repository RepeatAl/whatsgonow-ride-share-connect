
import { EntityType, StatusTransitionMap } from './types';
import { VALID_TRANSITIONS } from '@/constants/statusTransitions';

/**
 * Direct mapping of allowed transitions by entity type and status
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<EntityType, StatusTransitionMap> = {
  order: {
    created: ['offer_pending', 'cancelled'],
    offer_pending: ['deal_accepted', 'expired'],
    deal_accepted: ['confirmed_by_sender'],
    confirmed_by_sender: ['in_delivery'],
    in_delivery: ['delivered', 'dispute'],
    delivered: ['completed', 'dispute'],
    dispute: ['resolved', 'force_majeure_cancelled'],
    cancelled: [],
    expired: [],
    completed: [],
    resolved: [],
    force_majeure_cancelled: []
  },
  deal: {
    proposed: ['counter', 'accepted', 'rejected', 'expired'],
    counter: ['counter', 'accepted', 'rejected', 'expired'],
    accepted: [],
    rejected: [],
    expired: []
  },
  dispute: {
    open: ['under_review'],
    under_review: ['resolved', 'escalated'],
    escalated: ['resolved'],
    resolved: []
  }
};

/**
 * Überprüft, ob ein Statusübergang für einen bestimmten Entitätstyp gültig ist.
 * 
 * @param entityType Typ der Entität ('order', 'deal', oder 'dispute')
 * @param fromStatus Ausgangsstatus
 * @param toStatus Zielstatus
 * @returns true, wenn der Übergang gültig ist, sonst false
 */
export function isValidStatusTransition(
  entityType: EntityType,
  fromStatus: string, 
  toStatus: string
): boolean {
  const transitions = ALLOWED_STATUS_TRANSITIONS[entityType];
  if (!transitions) {
    console.error(`Ungültiger Entity-Typ: ${entityType}`);
    return false;
  }
  
  if (!transitions[fromStatus]) {
    console.error(`Ungültiger Ausgangsstatus für ${entityType}: ${fromStatus}`);
    return false;
  }
  
  return transitions[fromStatus].includes(toStatus);
}

/**
 * Überprüft, ob ein Statusübergang für einen bestimmten Entitätstyp gültig ist.
 * Legacy-Funktion für Kompatibilität
 */
export function validateStatusChange(
  entityType: EntityType,
  fromStatus: string,
  toStatus: string
): boolean {
  if (!VALID_TRANSITIONS[entityType]) {
    console.error(`Ungültiger Entity-Typ: ${entityType}`);
    return false;
  }
  
  if (!VALID_TRANSITIONS[entityType][fromStatus]) {
    console.error(`Ungültiger Ausgangsstatus für ${entityType}: ${fromStatus}`);
    return false;
  }
  
  return VALID_TRANSITIONS[entityType][fromStatus].includes(toStatus);
}


import { VALID_TRANSITIONS, STATUS_PERMISSIONS } from '@/constants/statusTransitions';
import { AuditEventType, AuditEntityType } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';
import { supabase } from '@/integrations/supabase/client';

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

export enum DealStatus {
  PROPOSED = 'proposed',
  COUNTER = 'counter',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved'
}

type EntityType = 'order' | 'deal' | 'dispute';

type StatusTransitionMap = {
  [key: string]: string[];
};

// Direct mapping of allowed transitions by entity type and status
export const ALLOWED_STATUS_TRANSITIONS: Record<EntityType, StatusTransitionMap> = {
  order: {
    [OrderStatus.CREATED]: [OrderStatus.OFFER_PENDING, OrderStatus.CANCELLED],
    [OrderStatus.OFFER_PENDING]: [OrderStatus.DEAL_ACCEPTED, OrderStatus.EXPIRED],
    [OrderStatus.DEAL_ACCEPTED]: [OrderStatus.CONFIRMED_BY_SENDER],
    [OrderStatus.CONFIRMED_BY_SENDER]: [OrderStatus.IN_DELIVERY],
    [OrderStatus.IN_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.DISPUTE],
    [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.DISPUTE],
    [OrderStatus.DISPUTE]: [OrderStatus.RESOLVED, OrderStatus.FORCE_MAJEURE_CANCELLED],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.EXPIRED]: [],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.RESOLVED]: [],
    [OrderStatus.FORCE_MAJEURE_CANCELLED]: []
  },
  deal: {
    [DealStatus.PROPOSED]: [DealStatus.COUNTER, DealStatus.ACCEPTED, DealStatus.REJECTED, DealStatus.EXPIRED],
    [DealStatus.COUNTER]: [DealStatus.COUNTER, DealStatus.ACCEPTED, DealStatus.REJECTED, DealStatus.EXPIRED],
    [DealStatus.ACCEPTED]: [],
    [DealStatus.REJECTED]: [],
    [DealStatus.EXPIRED]: []
  },
  dispute: {
    [DisputeStatus.OPEN]: [DisputeStatus.UNDER_REVIEW],
    [DisputeStatus.UNDER_REVIEW]: [DisputeStatus.RESOLVED, DisputeStatus.ESCALATED],
    [DisputeStatus.ESCALATED]: [DisputeStatus.RESOLVED],
    [DisputeStatus.RESOLVED]: []
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

/**
 * Überprüft, ob ein Benutzer die Berechtigung hat, einen bestimmten Statusübergang durchzuführen.
 * 
 * @param entityType Typ der Entität
 * @param fromStatus Ausgangsstatus
 * @param toStatus Zielstatus
 * @param userRole Rolle des Benutzers
 * @returns true, wenn der Benutzer berechtigt ist, sonst false
 */
export function hasPermissionForStatusChange(
  entityType: EntityType,
  fromStatus: string,
  toStatus: string,
  userRole: string
): boolean {
  // Spezialfall für Systemrollen
  if (userRole === 'system' || userRole === 'super_admin') {
    return true;
  }
  
  try {
    // Prüfen, ob Berechtigungsdefinitionen existieren
    if (!STATUS_PERMISSIONS[entityType] ||
        !STATUS_PERMISSIONS[entityType][fromStatus] ||
        !STATUS_PERMISSIONS[entityType][fromStatus][toStatus]) {
      return false;
    }
    
    // Prüfen, ob die Benutzerrolle in den erlaubten Rollen enthalten ist
    const allowedRoles = STATUS_PERMISSIONS[entityType][fromStatus][toStatus];
    return allowedRoles.includes(userRole);
  } catch (error) {
    console.error('Fehler bei der Berechtigungsprüfung:', error);
    return false;
  }
}

/**
 * Führt eine Statusänderung durch und validiert diese.
 * Erstellt auch einen Audit-Log-Eintrag für die Änderung.
 * 
 * @param entityType Typ der Entität ('order', 'deal', oder 'dispute')
 * @param entityId ID der Entität
 * @param fromStatus Ausgangsstatus
 * @param toStatus Zielstatus
 * @param userId ID des Benutzers, der die Änderung durchführt
 * @param userRole Rolle des Benutzers
 * @param metadata Zusätzliche Metadaten für den Audit-Log
 * @returns Ergebnisobjekt mit Erfolg/Fehlerinformationen
 */
export async function performStatusChange(
  entityType: EntityType,
  entityId: string,
  fromStatus: string,
  toStatus: string,
  userId: string,
  userRole: string,
  metadata: Record<string, any> = {}
): Promise<{ success: boolean; error?: string }> {
  // Validierung des Statusübergangs mit neuer Funktion
  if (!isValidStatusTransition(entityType, fromStatus, toStatus)) {
    return { 
      success: false, 
      error: `Ungültiger Statusübergang von '${fromStatus}' nach '${toStatus}' für ${entityType}`
    };
  }
  
  // Berechtigungsprüfung
  if (!hasPermissionForStatusChange(entityType, fromStatus, toStatus, userRole)) {
    return {
      success: false,
      error: `Keine Berechtigung für Statusübergang von '${fromStatus}' nach '${toStatus}' für Rolle ${userRole}`
    };
  }
  
  // Tabellenzuordnung
  const tableMap: Record<EntityType, string> = {
    order: 'orders',
    deal: 'deals',
    dispute: 'disputes'
  };
  
  const idFieldMap: Record<EntityType, string> = {
    order: 'order_id',
    deal: 'deal_id',
    dispute: 'id'
  };
  
  const tableName = tableMap[entityType];
  const idField = idFieldMap[entityType];
  
  try {
    // Status in Datenbank aktualisieren
    const { error } = await supabase
      .from(tableName)
      .update({ status: toStatus })
      .eq(idField, entityId);
    
    if (error) throw error;
    
    // Audit-Log erstellen
    const { logEvent } = useSystemAudit();
    await logEvent({
      eventType: AuditEventType.STATUS_CHANGED,
      entityType: entityType as unknown as AuditEntityType,
      entityId,
      actorId: userId,
      metadata: {
        fromStatus,
        toStatus,
        role: userRole,
        ...metadata
      }
    });
    
    return { success: true };
  } catch (err) {
    console.error('Fehler beim Statuswechsel:', err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Aktuelle Status einer Entität abrufen.
 * 
 * @param entityType Typ der Entität ('order', 'deal', oder 'dispute')
 * @param entityId ID der Entität
 * @returns Aktueller Status oder null, wenn nicht gefunden
 */
export async function getCurrentStatus(
  entityType: EntityType,
  entityId: string
): Promise<string | null> {
  // Tabellenzuordnung
  const tableMap: Record<EntityType, string> = {
    order: 'orders',
    deal: 'deals',
    dispute: 'disputes'
  };
  
  const idFieldMap: Record<EntityType, string> = {
    order: 'order_id',
    deal: 'deal_id',
    dispute: 'id'
  };
  
  const tableName = tableMap[entityType];
  const idField = idFieldMap[entityType];
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('status')
      .eq(idField, entityId)
      .single();
    
    if (error) throw error;
    
    return data?.status || null;
  } catch (err) {
    console.error(`Fehler beim Abrufen des Status für ${entityType} ${entityId}:`, err);
    return null;
  }
}

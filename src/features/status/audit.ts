
import { AuditEventType, AuditEntityType } from '@/constants/auditEvents';
import { EntityType } from './types';

/**
 * Erstellt einen Audit-Log-Eintrag für die Statusänderung
 * 
 * @param entityType Typ der Entität
 * @param entityId ID der Entität
 * @param fromStatus Ausgangsstatus
 * @param toStatus Zielstatus
 * @param userId ID des Benutzers, der die Änderung durchführt
 * @param userRole Rolle des Benutzers
 * @param additionalMetadata Zusätzliche Metadaten für den Audit-Log
 * @returns Ergebnis der Audit-Log-Erstellung
 */
export async function logStatusChange(
  entityType: EntityType,
  entityId: string,
  fromStatus: string,
  toStatus: string,
  userId: string,
  userRole: string,
  additionalMetadata: Record<string, any> = {}
): Promise<{ success: boolean; error?: any }> {
  try {
    // Import directly instead of using React hook
    const { logEvent } = require('@/hooks/use-system-audit').default();

    const result = await logEvent({
      eventType: AuditEventType.STATUS_CHANGED,
      entityType: entityType as unknown as AuditEntityType,
      entityId,
      actorId: userId,
      metadata: {
        fromStatus,
        toStatus,
        role: userRole,
        ...additionalMetadata
      }
    });
    
    return result;
  } catch (err) {
    console.error('Fehler beim Erstellen des Audit-Logs:', err);
    return { success: false, error: err };
  }
}

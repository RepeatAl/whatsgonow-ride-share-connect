
import { EntityType } from './types';
import { isValidStatusTransition } from './validation';
import { hasPermissionForStatusChange } from './permissions';
import { updateStatusInDatabase } from './database';
import { logStatusChange } from './audit';

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
  // Validierung des Statusübergangs
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
  
  try {
    // Status in Datenbank aktualisieren
    const dbResult = await updateStatusInDatabase(entityType, entityId, toStatus);
    if (!dbResult.success) {
      throw new Error(dbResult.error || 'Fehler beim Aktualisieren des Status');
    }
    
    // Audit-Log erstellen
    const auditResult = await logStatusChange(
      entityType,
      entityId,
      fromStatus,
      toStatus,
      userId,
      userRole,
      metadata
    );
    
    if (!auditResult.success) {
      console.warn('Audit-Log konnte nicht erstellt werden:', auditResult.error);
      // Wir lassen die Statusänderung trotzdem als erfolgreich durchgehen
    }
    
    return { success: true };
  } catch (err) {
    console.error('Fehler beim Statuswechsel:', err);
    return { success: false, error: (err as Error).message };
  }
}


import { EntityType } from './types';
import { STATUS_PERMISSIONS } from '@/constants/statusTransitions';

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

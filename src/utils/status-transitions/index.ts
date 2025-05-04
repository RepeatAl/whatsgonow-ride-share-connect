
/**
 * Status-Transitions-Modul
 *
 * Dieses Modul bietet Funktionen zur Verwaltung von Statusübergängen
 * für verschiedene Entitätstypen im System (Orders, Deals, Disputes).
 *
 * Es enthält Funktionen für die Validierung von Statusübergängen,
 * Berechtigungsprüfungen und die Durchführung von Statusänderungen.
 */

// Re-exportieren aller Typen und Enums
export * from './types';

// Re-exportieren der Validierungsfunktionen
export {
  isValidStatusTransition,
  validateStatusChange,
  ALLOWED_STATUS_TRANSITIONS
} from './validation';

// Re-exportieren der Berechtigungsprüfungsfunktionen
export { hasPermissionForStatusChange } from './permissions';

// Re-exportieren der Datenbankfunktionen
export {
  getCurrentStatus,
  updateStatusInDatabase,
  TABLE_MAPPING,
  ID_FIELD_MAPPING
} from './database';

// Re-exportieren der Audit-Funktionen
export { logStatusChange } from './audit';

// Re-exportieren der Kernfunktionen
export { performStatusChange } from './core';

/**
 * @deprecated Verwende stattdessen die Funktionen aus dem status-transitions-Modul.
 */
export { OrderStatus, DealStatus, DisputeStatus } from './types';
export type { EntityType } from './types';

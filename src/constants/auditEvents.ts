/**
 * Audit-Event-Typen für das System.
 * Diese Konstanten definieren alle möglichen Audit-Events, die im System protokolliert werden.
 */

/**
 * Alle verfügbaren Audit-Event-Typen.
 * Die Events sind nach Funktionsbereichen gruppiert.
 */
export enum AuditEventType {
  // Order/Deal Events
  ORDER_CREATED = 'ORDER_CREATED',
  OFFER_SUBMITTED = 'OFFER_SUBMITTED',
  DEAL_PROPOSED = 'DEAL_PROPOSED',
  DEAL_COUNTER_PROPOSED = 'DEAL_COUNTER_PROPOSED',
  DEAL_ACCEPTED = 'DEAL_ACCEPTED',
  DEAL_REJECTED = 'DEAL_REJECTED',
  DEAL_EXPIRED = 'DEAL_EXPIRED',
  DEAL_ACCEPT_FAILED = 'DEAL_ACCEPT_FAILED',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_EXPIRED = 'ORDER_EXPIRED',
  ORDER_EXPIRATION_ASSIGNED = 'ORDER_EXPIRATION_ASSIGNED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  
  // Delivery Events
  QR_GENERATED = 'QR_GENERATED',
  QR_SCANNED = 'QR_SCANNED',
  QR_BACKUP_USED = 'QR_BACKUP_USED',
  DELIVERY_STARTED = 'DELIVERY_STARTED',
  DELIVERY_COMPLETED = 'DELIVERY_COMPLETED',
  DELIVERY_CONFIRMED = 'DELIVERY_CONFIRMED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  
  // Payment Events
  PAYMENT_RESERVED = 'PAYMENT_RESERVED',
  PAYMENT_RELEASED = 'PAYMENT_RELEASED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  
  // User Events
  USER_REGISTERED = 'USER_REGISTERED',
  USER_VERIFIED = 'USER_VERIFIED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  USER_REACTIVATED = 'USER_REACTIVATED',
  USER_DELETED = 'USER_DELETED',
  
  // Support/Admin Events
  SUPPORT_TICKET_CREATED = 'SUPPORT_TICKET_CREATED',
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  DISPUTE_ESCALATED = 'DISPUTE_ESCALATED', // Add this line to fix the missing event type
  FORCE_MAJEURE_ACTIVATED = 'FORCE_MAJEURE_ACTIVATED',
  ADMIN_ACTION = 'ADMIN_ACTION',
  STAGING_STATE_EXPIRED = 'STAGING_STATE_EXPIRED',
  
  // Security Events
  FAILED_LOGIN_ATTEMPT = 'FAILED_LOGIN_ATTEMPT',
  UNUSUAL_ACCESS_PATTERN = 'UNUSUAL_ACCESS_PATTERN',
  ROLE_CHANGED = 'ROLE_CHANGED',
  API_ACCESS_DENIED = 'API_ACCESS_DENIED'
}

/**
 * Schweregrade für Audit-Events.
 */
export enum AuditSeverity {
  INFO = 'INFO',       // Retention: 90 Tage
  WARN = 'WARN',       // Retention: 180 Tage
  CRITICAL = 'CRITICAL' // Retention: 10 Jahre (GoBD-konform)
}

/**
 * Entitätstypen für Audit-Events.
 */
export enum AuditEntityType {
  ORDER = 'order',
  USER = 'user',
  OFFER = 'offer',
  DEAL = 'deal',
  SUPPORT_TICKET = 'support_ticket',
  PAYMENT = 'payment',
  SYSTEM = 'system',
  DISPUTE = 'dispute',
  INVOICE = 'invoice'
}

/**
 * Mapping von Event-Typ zu Standard-Schweregrad.
 * Wird verwendet, wenn kein Schweregrad explizit angegeben ist.
 */
export const DEFAULT_EVENT_SEVERITY: Record<AuditEventType, AuditSeverity> = {
  // Order/Deal mit INFO
  [AuditEventType.ORDER_CREATED]: AuditSeverity.INFO,
  [AuditEventType.OFFER_SUBMITTED]: AuditSeverity.INFO,
  [AuditEventType.DEAL_PROPOSED]: AuditSeverity.INFO,
  [AuditEventType.DEAL_COUNTER_PROPOSED]: AuditSeverity.INFO,
  [AuditEventType.DEAL_REJECTED]: AuditSeverity.INFO,
  
  // Order/Deal mit WARN
  [AuditEventType.DEAL_EXPIRED]: AuditSeverity.WARN,
  [AuditEventType.ORDER_CANCELLED]: AuditSeverity.WARN,
  [AuditEventType.ORDER_EXPIRED]: AuditSeverity.WARN,
  [AuditEventType.ORDER_EXPIRATION_ASSIGNED]: AuditSeverity.INFO,
  [AuditEventType.DEAL_ACCEPT_FAILED]: AuditSeverity.WARN,
  
  // Order/Deal mit CRITICAL
  [AuditEventType.DEAL_ACCEPTED]: AuditSeverity.CRITICAL,
  [AuditEventType.STATUS_CHANGED]: AuditSeverity.INFO, // Variabel, wird überschrieben
  
  // Delivery mit INFO
  [AuditEventType.QR_GENERATED]: AuditSeverity.INFO,
  [AuditEventType.DELIVERY_STARTED]: AuditSeverity.INFO,
  
  // Delivery mit WARN
  [AuditEventType.DELIVERY_FAILED]: AuditSeverity.WARN,
  
  // Delivery mit CRITICAL
  [AuditEventType.QR_SCANNED]: AuditSeverity.CRITICAL,
  [AuditEventType.QR_BACKUP_USED]: AuditSeverity.CRITICAL,
  [AuditEventType.DELIVERY_COMPLETED]: AuditSeverity.CRITICAL,
  [AuditEventType.DELIVERY_CONFIRMED]: AuditSeverity.CRITICAL,
  
  // Payment immer CRITICAL
  [AuditEventType.PAYMENT_RESERVED]: AuditSeverity.CRITICAL,
  [AuditEventType.PAYMENT_RELEASED]: AuditSeverity.CRITICAL,
  [AuditEventType.PAYMENT_FAILED]: AuditSeverity.CRITICAL,
  [AuditEventType.PAYMENT_REFUNDED]: AuditSeverity.CRITICAL,
  
  // User mit INFO
  [AuditEventType.USER_REGISTERED]: AuditSeverity.INFO,
  [AuditEventType.PROFILE_UPDATED]: AuditSeverity.INFO,
  [AuditEventType.USER_REACTIVATED]: AuditSeverity.INFO,
  
  // User mit WARN
  [AuditEventType.USER_VERIFIED]: AuditSeverity.WARN,
  [AuditEventType.USER_DEACTIVATED]: AuditSeverity.WARN,
  
  // User mit CRITICAL
  [AuditEventType.USER_DELETED]: AuditSeverity.CRITICAL,
  
  // Support/Admin mit INFO
  [AuditEventType.SUPPORT_TICKET_CREATED]: AuditSeverity.INFO,
  
  // Support/Admin mit WARN
  [AuditEventType.STAGING_STATE_EXPIRED]: AuditSeverity.WARN,
  
  // Support/Admin mit CRITICAL
  [AuditEventType.DISPUTE_OPENED]: AuditSeverity.CRITICAL,
  [AuditEventType.DISPUTE_RESOLVED]: AuditSeverity.CRITICAL,
  [AuditEventType.DISPUTE_ESCALATED]: AuditSeverity.CRITICAL, // Add mapping for new event type
  [AuditEventType.FORCE_MAJEURE_ACTIVATED]: AuditSeverity.CRITICAL,
  [AuditEventType.ADMIN_ACTION]: AuditSeverity.CRITICAL,
  
  // Security mit WARN
  [AuditEventType.FAILED_LOGIN_ATTEMPT]: AuditSeverity.WARN,
  [AuditEventType.API_ACCESS_DENIED]: AuditSeverity.WARN,
  
  // Security mit CRITICAL
  [AuditEventType.UNUSUAL_ACCESS_PATTERN]: AuditSeverity.CRITICAL,
  [AuditEventType.ROLE_CHANGED]: AuditSeverity.CRITICAL,
};

/**
 * Retention-Zeiten in Tagen nach Schweregrad.
 */
export const RETENTION_DAYS: Record<AuditSeverity, number> = {
  [AuditSeverity.INFO]: 90,     // 3 Monate
  [AuditSeverity.WARN]: 180,    // 6 Monate
  [AuditSeverity.CRITICAL]: 3652 // 10 Jahre (GoBD-konform)
};

/**
 * Standard-Sichtbarkeitsstufen pro Schweregrad.
 * Definiert, welche Rollen standardmäßig diesen Event-Typ sehen dürfen.
 */
export const DEFAULT_VISIBILITY: Record<AuditSeverity, string[]> = {
  [AuditSeverity.INFO]: ['admin', 'super_admin', 'cm'],
  [AuditSeverity.WARN]: ['admin', 'super_admin', 'cm'],
  [AuditSeverity.CRITICAL]: ['admin', 'super_admin']
};

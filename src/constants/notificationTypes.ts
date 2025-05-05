
/**
 * Enumeration für verschiedene Arten von Benachrichtigungen
 * Diese werden verwendet, um den Typ einer Benachrichtigung zu bestimmen und 
 * entsprechende Formatierungen und Aktionen auszulösen.
 */
export enum NotificationType {
  // Auftragsbenachrichtigungen
  ORDER_EXPIRY_WARNING = 'order_expiry_warning',
  ORDER_EXPIRED = 'order_expired',
  ORDER_STATUS_CHANGED = 'order_status_changed',
  
  // Angebotsbenachrichtigungen
  DEAL_PROPOSED = 'deal_proposed',
  DEAL_ACCEPTED = 'deal_accepted',
  DEAL_REJECTED = 'deal_rejected',
  DEAL_COUNTER = 'deal_counter',
  
  // Streitfallbenachrichtigungen
  DISPUTE_OPENED = 'dispute_opened',
  DISPUTE_RESOLVED = 'dispute_resolved',
  
  // Zahlungsbenachrichtigungen
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  
  // Systembenachrichtigungen
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

/**
 * Prioritätsstufen für Benachrichtigungen
 */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Zuordnung von Benachrichtigungstypen zu Standardprioritäten
 */
export const NOTIFICATION_PRIORITIES: Record<NotificationType, NotificationPriority> = {
  [NotificationType.ORDER_EXPIRY_WARNING]: NotificationPriority.HIGH,
  [NotificationType.ORDER_EXPIRED]: NotificationPriority.MEDIUM,
  [NotificationType.ORDER_STATUS_CHANGED]: NotificationPriority.MEDIUM,
  [NotificationType.DEAL_PROPOSED]: NotificationPriority.MEDIUM,
  [NotificationType.DEAL_ACCEPTED]: NotificationPriority.HIGH,
  [NotificationType.DEAL_REJECTED]: NotificationPriority.MEDIUM,
  [NotificationType.DEAL_COUNTER]: NotificationPriority.MEDIUM,
  [NotificationType.DISPUTE_OPENED]: NotificationPriority.HIGH,
  [NotificationType.DISPUTE_RESOLVED]: NotificationPriority.HIGH,
  [NotificationType.PAYMENT_INITIATED]: NotificationPriority.MEDIUM,
  [NotificationType.PAYMENT_COMPLETED]: NotificationPriority.MEDIUM,
  [NotificationType.PAYMENT_FAILED]: NotificationPriority.HIGH,
  [NotificationType.SYSTEM_ANNOUNCEMENT]: NotificationPriority.MEDIUM
};

/**
 * Standardtitel für Benachrichtigungen nach Typ
 */
export const DEFAULT_NOTIFICATION_TITLES: Record<NotificationType, string> = {
  [NotificationType.ORDER_EXPIRY_WARNING]: 'Auftrag läuft bald ab',
  [NotificationType.ORDER_EXPIRED]: 'Auftrag abgelaufen',
  [NotificationType.ORDER_STATUS_CHANGED]: 'Auftragsstatus geändert',
  [NotificationType.DEAL_PROPOSED]: 'Neues Angebot erhalten',
  [NotificationType.DEAL_ACCEPTED]: 'Angebot angenommen',
  [NotificationType.DEAL_REJECTED]: 'Angebot abgelehnt',
  [NotificationType.DEAL_COUNTER]: 'Neues Gegenangebot',
  [NotificationType.DISPUTE_OPENED]: 'Neuer Streitfall eröffnet',
  [NotificationType.DISPUTE_RESOLVED]: 'Streitfall gelöst',
  [NotificationType.PAYMENT_INITIATED]: 'Zahlung eingeleitet',
  [NotificationType.PAYMENT_COMPLETED]: 'Zahlung abgeschlossen',
  [NotificationType.PAYMENT_FAILED]: 'Zahlung fehlgeschlagen',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: 'Systemmitteilung'
};

/**
 * Icons für verschiedene Benachrichtigungstypen
 */
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  [NotificationType.ORDER_EXPIRY_WARNING]: 'clock',
  [NotificationType.ORDER_EXPIRED]: 'ban',
  [NotificationType.ORDER_STATUS_CHANGED]: 'refresh-cw',
  [NotificationType.DEAL_PROPOSED]: 'mail',
  [NotificationType.DEAL_ACCEPTED]: 'check-circle',
  [NotificationType.DEAL_REJECTED]: 'x-circle',
  [NotificationType.DEAL_COUNTER]: 'repeat',
  [NotificationType.DISPUTE_OPENED]: 'alert-triangle',
  [NotificationType.DISPUTE_RESOLVED]: 'check',
  [NotificationType.PAYMENT_INITIATED]: 'credit-card',
  [NotificationType.PAYMENT_COMPLETED]: 'check-circle',
  [NotificationType.PAYMENT_FAILED]: 'alert-circle',
  [NotificationType.SYSTEM_ANNOUNCEMENT]: 'bell'
};

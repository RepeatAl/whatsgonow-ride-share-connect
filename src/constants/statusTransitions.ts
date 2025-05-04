
/**
 * Diese Datei definiert die gültigen Status-Übergänge für verschiedene Entitätstypen
 * im System. Sie wird von der validateStatusChange-Funktion in src/utils/status-transition.ts
 * verwendet, um die Gültigkeit von Status-Übergängen zu überprüfen.
 */

/**
 * Gültige Status-Übergänge nach Entitätstyp.
 * Das Format ist: { [entityType]: { [fromStatus]: [toStatus1, toStatus2, ...] } }
 */
export const VALID_TRANSITIONS = {
  order: {
    created: ['offer_pending', 'cancelled'],
    offer_pending: ['deal_accepted', 'deal_rejected', 'expired'],
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
 * Mapping von Status zu benutzerfreundlichen Anzeigenamen.
 */
export const STATUS_LABELS = {
  order: {
    created: 'Erstellt',
    offer_pending: 'Angebote ausstehend',
    deal_accepted: 'Angebot angenommen',
    confirmed_by_sender: 'Vom Auftraggeber bestätigt',
    in_delivery: 'In Lieferung',
    delivered: 'Ausgeliefert',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    expired: 'Abgelaufen',
    dispute: 'Im Streitfall',
    resolved: 'Gelöst',
    force_majeure_cancelled: 'Force Majeure (storniert)'
  },
  deal: {
    proposed: 'Vorgeschlagen',
    counter: 'Gegenangebot',
    accepted: 'Angenommen',
    rejected: 'Abgelehnt',
    expired: 'Abgelaufen'
  },
  dispute: {
    open: 'Offen',
    under_review: 'In Prüfung',
    escalated: 'Eskaliert',
    resolved: 'Gelöst'
  }
};

/**
 * Mapping von Status zu Berechtigung für Statusänderungen.
 * Format: { [entityType]: { [fromStatus]: { [toStatus]: [allowedRoles] } } }
 */
export const STATUS_PERMISSIONS = {
  order: {
    created: {
      offer_pending: ['sender_private', 'sender_business'],
      cancelled: ['sender_private', 'sender_business']
    },
    offer_pending: {
      deal_accepted: ['sender_private', 'sender_business'],
      deal_rejected: ['sender_private', 'sender_business'],
      expired: ['system']
    },
    deal_accepted: {
      confirmed_by_sender: ['sender_private', 'sender_business']
    },
    confirmed_by_sender: {
      in_delivery: ['driver']
    },
    in_delivery: {
      delivered: ['driver'],
      dispute: ['driver', 'sender_private', 'sender_business']
    },
    delivered: {
      completed: ['sender_private', 'sender_business'],
      dispute: ['driver', 'sender_private', 'sender_business']
    },
    dispute: {
      resolved: ['cm', 'admin', 'super_admin'],
      force_majeure_cancelled: ['admin', 'super_admin']
    }
  },
  // Ähnliche Definitionen für deal und dispute...
};

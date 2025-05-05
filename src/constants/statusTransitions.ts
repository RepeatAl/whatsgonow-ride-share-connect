
/**
 * Definiert erlaubte Status-Übergänge für Orders, Deals und Disputes.
 * Format: { entityType: { fromStatus: [erlaubte Ziel-Status] } }
 */
export const VALID_TRANSITIONS = {
  order: {
    created: ['offer_pending', 'cancelled'],
    offer_pending: ['deal_accepted', 'expired', 'cancelled'],
    deal_accepted: ['confirmed_by_sender', 'dispute', 'cancelled'],
    confirmed_by_sender: ['in_delivery', 'dispute', 'cancelled'],
    in_delivery: ['delivered', 'dispute', 'force_majeure_cancelled'],
    delivered: ['completed', 'dispute'],
    dispute: ['resolved', 'force_majeure_cancelled'],
    expired: [], // Keine weiteren Übergänge erlaubt
    cancelled: [], // Keine weiteren Übergänge erlaubt
    completed: [], // Keine weiteren Übergänge erlaubt
    resolved: [],  // Keine weiteren Übergänge erlaubt
    force_majeure_cancelled: [] // Keine weiteren Übergänge erlaubt
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
 * Definiert Berechtigungen für Status-Übergänge.
 * Format: { entityType: { fromStatus: { toStatus: [erlaubte Rollen] } } }
 */
export const STATUS_PERMISSIONS = {
  order: {
    created: {
      offer_pending: ['sender_private', 'sender_business'],
      cancelled: ['sender_private', 'sender_business', 'admin', 'super_admin']
    },
    offer_pending: {
      deal_accepted: ['sender_private', 'sender_business'],
      expired: ['system', 'admin', 'super_admin'],
      cancelled: ['sender_private', 'sender_business', 'admin', 'super_admin']
    },
    deal_accepted: {
      confirmed_by_sender: ['sender_private', 'sender_business'],
      dispute: ['sender_private', 'sender_business', 'driver', 'admin', 'super_admin'],
      cancelled: ['sender_private', 'sender_business', 'driver', 'admin', 'super_admin']
    },
    confirmed_by_sender: {
      in_delivery: ['driver'],
      dispute: ['sender_private', 'sender_business', 'driver', 'admin', 'super_admin'],
      cancelled: ['sender_private', 'sender_business', 'driver', 'admin', 'super_admin']
    },
    in_delivery: {
      delivered: ['driver'],
      dispute: ['sender_private', 'sender_business', 'driver', 'admin', 'super_admin'],
      force_majeure_cancelled: ['admin', 'super_admin']
    },
    delivered: {
      completed: ['sender_private', 'sender_business'],
      dispute: ['sender_private', 'sender_business', 'driver', 'admin', 'super_admin']
    },
    dispute: {
      resolved: ['cm', 'admin', 'super_admin'],
      force_majeure_cancelled: ['admin', 'super_admin']
    }
  },
  deal: {
    proposed: {
      counter: ['sender_private', 'sender_business', 'driver'],
      accepted: ['sender_private', 'sender_business'],
      rejected: ['sender_private', 'sender_business'],
      expired: ['system', 'admin', 'super_admin']
    },
    counter: {
      counter: ['sender_private', 'sender_business', 'driver'],
      accepted: ['sender_private', 'sender_business', 'driver'],
      rejected: ['sender_private', 'sender_business', 'driver'],
      expired: ['system', 'admin', 'super_admin']
    }
  },
  dispute: {
    open: {
      under_review: ['cm', 'admin', 'super_admin']
    },
    under_review: {
      resolved: ['cm', 'admin', 'super_admin'],
      escalated: ['cm', 'admin', 'super_admin']
    },
    escalated: {
      resolved: ['admin', 'super_admin']
    }
  }
};

/**
 * Benutzerfreundliche Status-Labels für die UI.
 * Format: { entityType: { status: label } }
 */
export const STATUS_LABELS = {
  order: {
    created: 'Erstellt',
    offer_pending: 'Angebote ausstehend',
    deal_accepted: 'Angebot angenommen',
    confirmed_by_sender: 'Vom Absender bestätigt',
    in_delivery: 'In Lieferung',
    delivered: 'Geliefert',
    completed: 'Abgeschlossen',
    dispute: 'Im Streitfall',
    expired: 'Abgelaufen',
    cancelled: 'Storniert',
    resolved: 'Gelöst',
    force_majeure_cancelled: 'Höhere Gewalt'
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

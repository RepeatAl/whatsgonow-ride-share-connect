
/**
 * Permission Matrix für das Public-First Auth-System
 * Definiert welche Aktionen Login erfordern vs. öffentlich nutzbar sind
 * 
 * Stand: 08. Juni 2025 - Aktualisiert mit vollständiger Public-First-Logik
 */

export interface LoginRequiredAction {
  action: string;
  requiresLogin: boolean;
  requiredRoles?: string[];
  description: string;
  category: 'transactional' | 'communication' | 'personal_data' | 'upload' | 'public';
}

export const loginRequiredActions: Record<string, LoginRequiredAction> = {
  // === TRANSAKTIONALE AKTIONEN - Login erforderlich ===
  create_order: {
    action: "create_order",
    requiresLogin: true,
    description: "Auftrag erstellen und veröffentlichen",
    category: "transactional"
  },
  publish_item: {
    action: "publish_item", 
    requiresLogin: true,
    description: "Artikel veröffentlichen und speichern",
    category: "upload"
  },
  book_transport: {
    action: "book_transport",
    requiresLogin: true,
    description: "Transport buchen - vertragsrelevant",
    category: "transactional"
  },
  accept_deal: {
    action: "accept_deal",
    requiresLogin: true,
    description: "Deal annehmen oder Buchung bestätigen",
    category: "transactional"
  },
  submit_offer: {
    action: "submit_offer",
    requiresLogin: true,
    description: "Angebot abgeben - vertragsbindend",
    category: "transactional"
  },
  accept_order: {
    action: "accept_order",
    requiresLogin: true,
    description: "Auftrag annehmen - Vertragsbindung",
    category: "transactional"
  },

  // === KOMMUNIKATION - Login erforderlich ===
  start_chat: {
    action: "start_chat",
    requiresLogin: true,
    description: "Chat starten oder Nachricht schreiben",
    category: "communication"
  },
  contact_driver: {
    action: "contact_driver",
    requiresLogin: true,
    description: "Fahrer kontaktieren - personenbezogene Kommunikation",
    category: "communication"
  },
  send_private_message: {
    action: "send_private_message",
    requiresLogin: true,
    description: "Private Nachricht senden - DSGVO-Schutz",
    category: "communication"
  },
  submit_feedback: {
    action: "submit_feedback",
    requiresLogin: true,
    description: "Bewertung oder Feedback abgeben",
    category: "communication"
  },
  open_dispute: {
    action: "open_dispute",
    requiresLogin: true,
    description: "Dispute eröffnen - Verantwortung & Nachvollziehbarkeit",
    category: "communication"
  },

  // === PERSÖNLICHE DATEN - Login erforderlich ===
  view_address: {
    action: "view_address",
    requiresLogin: true,
    description: "Vollständige Adresse anzeigen - Schutz privater Daten",
    category: "personal_data"
  },
  view_contact_data: {
    action: "view_contact_data",
    requiresLogin: true,
    description: "E-Mail-Adressen und Telefonnummern anzeigen",
    category: "personal_data"
  },
  save_profile: {
    action: "save_profile",
    requiresLogin: true,
    description: "Profildaten speichern",
    category: "personal_data"
  },
  edit_profile: {
    action: "edit_profile",
    requiresLogin: true,
    description: "Profil bearbeiten - Nutzerdaten-Zugriff",
    category: "personal_data"
  },
  manage_payment: {
    action: "manage_payment",
    requiresLogin: true,
    description: "Zahlungsdaten verwalten - sensible Finanzdaten",
    category: "personal_data"
  },
  upload_verification: {
    action: "upload_verification",
    requiresLogin: true,
    description: "Verifizierungsdaten hochladen",
    category: "personal_data"
  },
  view_location_data: {
    action: "view_location_data",
    requiresLogin: true,
    description: "GPS-Positionen mit Personenbezug anzeigen",
    category: "personal_data"
  },

  // === UPLOAD-AKTIONEN - Login für Speichern/Veröffentlichen ===
  save_item: {
    action: "save_item",
    requiresLogin: true,
    description: "Artikel dauerhaft speichern",
    category: "upload"
  },
  create_transport_request: {
    action: "create_transport_request",
    requiresLogin: true,
    description: "Transportanfrage erstellen",
    category: "transactional"
  },
  create_ride: {
    action: "create_ride",
    requiresLogin: true,
    description: "Mitfahrgelegenheit anbieten",
    category: "transactional"
  },

  // === ÖFFENTLICHE AKTIONEN - Kein Login erforderlich ===
  browse_items: {
    action: "browse_items",
    requiresLogin: false,
    description: "Artikel durchsuchen und ansehen",
    category: "public"
  },
  search_transport: {
    action: "search_transport",
    requiresLogin: false,
    description: "Transport suchen und filtern",
    category: "public"
  },
  view_public_info: {
    action: "view_public_info",
    requiresLogin: false,
    description: "Öffentliche Informationen anzeigen",
    category: "public"
  },
  view_ratings: {
    action: "view_ratings",
    requiresLogin: false,
    description: "Trust Score und Bewertungen anzeigen",
    category: "public"
  },
  view_company_info: {
    action: "view_company_info",
    requiresLogin: false,
    description: "Firmenname von Business-Nutzern anzeigen",
    category: "public"
  },
  change_language: {
    action: "change_language",
    requiresLogin: false,
    description: "Sprache wechseln",
    category: "public"
  },
  prepare_upload: {
    action: "prepare_upload",
    requiresLogin: false,
    description: "Dateien vorbereiten (vor Veröffentlichung)",
    category: "upload"
  },
  view_faq: {
    action: "view_faq",
    requiresLogin: false,
    description: "FAQ und Hilfe-Inhalte anzeigen",
    category: "public"
  },
  view_videos: {
    action: "view_videos",
    requiresLogin: false,
    description: "How-to-Videos und Plattform-Erklärungen anzeigen",
    category: "public"
  }
};

/**
 * Prüft ob eine Aktion Login erfordert
 */
export const requiresAuthentication = (action: string): boolean => {
  const actionConfig = loginRequiredActions[action];
  return actionConfig ? actionConfig.requiresLogin : false;
};

/**
 * Prüft ob eine Aktion eine bestimmte Rolle erfordert
 */
export const requiresRole = (action: string, userRole?: string): boolean => {
  const actionConfig = loginRequiredActions[action];
  if (!actionConfig || !actionConfig.requiredRoles) return true;
  
  return userRole ? actionConfig.requiredRoles.includes(userRole) : false;
};

/**
 * Öffentliche Aktionen die ohne Login möglich sind
 */
export const publicActions = Object.values(loginRequiredActions)
  .filter(action => !action.requiresLogin)
  .map(action => action.action);

/**
 * Private Aktionen die Login erfordern  
 */
export const protectedActions = Object.values(loginRequiredActions)
  .filter(action => action.requiresLogin)
  .map(action => action.action);

/**
 * Aktionen nach Kategorien gruppiert
 */
export const actionsByCategory = {
  transactional: Object.values(loginRequiredActions)
    .filter(action => action.category === 'transactional')
    .map(action => action.action),
    
  communication: Object.values(loginRequiredActions)
    .filter(action => action.category === 'communication')
    .map(action => action.action),
    
  personal_data: Object.values(loginRequiredActions)
    .filter(action => action.category === 'personal_data')
    .map(action => action.action),
    
  upload: Object.values(loginRequiredActions)
    .filter(action => action.category === 'upload')
    .map(action => action.action),
    
  public: Object.values(loginRequiredActions)
    .filter(action => action.category === 'public')
    .map(action => action.action)
};

/**
 * Hilfsfunktion für Sichtbarkeitsregeln nach Nutzerrolle
 */
export const getVisibilityRules = (userRole?: string) => {
  const rules = {
    // Für alle Nutzer geschützt
    protectedData: ['email', 'phone', 'private_address', 'gps_location'],
    
    // Rollenspezifische Sichtbarkeit
    sender_private: {
      name: 'protected',
      address: 'protected', 
      recipient_info: 'protected'
    },
    
    sender_business: {
      company_name: 'public',
      pickup_address: 'public_location_only',
      recipient_name: 'protected'
    },
    
    driver: {
      name: 'public_when_active',
      vehicle_description: 'public',
      delivery_proof: 'recipient_and_sender_only'
    }
  };
  
  return userRole ? rules[userRole as keyof typeof rules] || {} : {};
};

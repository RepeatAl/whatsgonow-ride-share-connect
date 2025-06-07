
/**
 * Permission Matrix für das Hybrid-Login-System
 * Definiert welche Aktionen Login erfordern (geschützter Bereich)
 * vs. welche öffentlich nutzbar sind
 */

export interface LoginRequiredAction {
  action: string;
  requiresLogin: boolean;
  requiredRoles?: string[];
  description: string;
}

export const loginRequiredActions: Record<string, LoginRequiredAction> = {
  // Geschützte Aktionen - Login erforderlich
  create_order: {
    action: "create_order",
    requiresLogin: true,
    description: "Auftrag erstellen und veröffentlichen"
  },
  publish_item: {
    action: "publish_item", 
    requiresLogin: true,
    description: "Artikel veröffentlichen"
  },
  start_chat: {
    action: "start_chat",
    requiresLogin: true,
    description: "Chat starten oder Nachricht schreiben"
  },
  view_address: {
    action: "view_address",
    requiresLogin: true,
    description: "Vollständige Adresse anzeigen"
  },
  accept_deal: {
    action: "accept_deal",
    requiresLogin: true,
    description: "Deal annehmen oder Buchung bestätigen"
  },
  create_ride: {
    action: "create_ride",
    requiresLogin: true,
    description: "Mitfahrgelegenheit anbieten"
  },
  submit_feedback: {
    action: "submit_feedback",
    requiresLogin: true,
    description: "Bewertung oder Feedback abgeben"
  },
  save_profile: {
    action: "save_profile",
    requiresLogin: true,
    description: "Profildaten speichern"
  },
  upload_verification: {
    action: "upload_verification",
    requiresLogin: true,
    description: "Verifizierungsdaten hochladen"
  },

  // Öffentliche Aktionen - kein Login erforderlich
  browse_items: {
    action: "browse_items",
    requiresLogin: false,
    description: "Artikel durchsuchen und ansehen"
  },
  search_transport: {
    action: "search_transport",
    requiresLogin: false,
    description: "Transport suchen und filtern"
  },
  view_public_info: {
    action: "view_public_info",
    requiresLogin: false,
    description: "Öffentliche Informationen anzeigen"
  },
  change_language: {
    action: "change_language",
    requiresLogin: false,
    description: "Sprache wechseln"
  },
  prepare_upload: {
    action: "prepare_upload",
    requiresLogin: false,
    description: "Dateien vorbereiten (vor Veröffentlichung)"
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

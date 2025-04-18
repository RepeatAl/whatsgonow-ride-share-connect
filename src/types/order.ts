// src/types/order.ts

/**
 * Repräsentiert einen Transportauftrag in der App.
 */
export interface Order {
  /** Eindeutige ID des Auftrags */
  order_id: string;
  /** Freitext-Beschreibung des Auftrags */
  description: string;
  /** Abholadresse */
  from_address: string;
  /** Lieferadresse */
  to_address: string;
  /** Gewicht in Kilogramm */
  weight: number;
  /** Spätestes Lieferdatum als ISO‑String */
  deadline: string;
  /** Aktueller Status (pending, accepted, completed, …) */
  status: string;
  /** Optional: ID des Auftraggebers */
  sender_id?: string;
  /** Optional: Zeitpunkt der Verifizierung als ISO‑String */
  verified_at?: string;
  /** Optional: Region des Auftrags */
  region?: string;
}

/**
 * Repräsentiert einen Nutzer mit Rolle und optionaler Region.
 */
export interface UserWithRole {
  /** Eindeutige User‑ID */
  id: string;
  /** Rolle des Nutzers (sender_private, driver, admin…) */
  role: string;
  /** Optional: Region, in der der Nutzer tätig ist */
  region?: string;
}

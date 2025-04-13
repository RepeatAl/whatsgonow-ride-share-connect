# Whatsgonow Datenbankschema (db.md)

Diese Datei dokumentiert das relationale Datenbankschema für Whatsgonow auf Basis von Supabase/PostgreSQL.  
Sie ist eng an die Anforderungen des MVP (siehe SRS) und die API-Endpunkte gekoppelt.

---

## 1. Übersicht der Haupttabellen

### `users`

| Feld         | Typ         | Beschreibung                          |
|--------------|-------------|---------------------------------------|
| user_id      | UUID        | Eindeutige ID des Nutzers             |
| role         | TEXT        | Nutzerrolle (sender, driver, cm, admin) |
| name         | TEXT        | Vor- und Nachname                     |
| email        | TEXT        | E-Mail-Adresse                        |
| region       | TEXT        | Region (z. B. „Berlin“)               |
| created_at   | TIMESTAMP   | Zeitpunkt der Registrierung           |

---

### `orders`

| Feld         | Typ         | Beschreibung                          |
|--------------|-------------|---------------------------------------|
| order_id     | UUID        | Eindeutige ID des Auftrags            |
| sender_id    | UUID        | Referenz auf `users.user_id`          |
| description  | TEXT        | Beschreibung des Transportguts        |
| from_address | TEXT        | Abholadresse                          |
| to_address   | TEXT        | Zieladresse                           |
| weight       | DECIMAL     | Gewicht in kg                         |
| dimensions   | TEXT        | Abmessungen als String (z. B. "40x30x20cm") |
| deadline     | TIMESTAMP   | Lieferzeitfenster-Ende                |
| status       | TEXT        | Status („offen“, „matched“, „unterwegs“, „abgeschlossen“) |

---

### `offers`

| Feld         | Typ         | Beschreibung                          |
|--------------|-------------|---------------------------------------|
| offer_id     | UUID        | Eindeutige ID des Angebots            |
| order_id     | UUID        | Referenz auf `orders.order_id`        |
| driver_id    | UUID        | Referenz auf `users.user_id` (Rolle: Fahrer) |
| price        | DECIMAL     | Angebotener Preis                     |
| status       | TEXT        | Status („eingereicht“, „angenommen“, „abgelehnt“) |

---

### `transactions`

| Feld         | Typ         | Beschreibung                          |
|--------------|-------------|---------------------------------------|
| tx_id        | UUID        | Eindeutige Transaktions-ID            |
| order_id     | UUID        | Referenz auf `orders.order_id`        |
| payer_id     | UUID        | Auftraggeber                          |
| receiver_id  | UUID        | Fahrer                                |
| amount       | DECIMAL     | Betrag in EUR                         |
| timestamp    | TIMESTAMP   | Zahlungszeitpunkt                     |

---

### `ratings`

| Feld         | Typ         | Beschreibung                          |
|--------------|-------------|---------------------------------------|
| rating_id    | UUID        | Bewertungs-ID                         |
| from_user    | UUID        | Bewertender Nutzer                    |
| to_user      | UUID        | Bewerteter Nutzer                     |
| order_id     | UUID        | Zugehöriger Auftrag                   |
| score        | INTEGER     | Sternebewertung (1–5)                 |
| comment      | TEXT        | Optionaler Kommentar                  |

---

### `community_managers`

| Feld             | Typ      | Beschreibung                          |
|------------------|----------|---------------------------------------|
| user_id          | UUID     | Referenz auf `users.user_id`          |
| region           | TEXT     | Zuständigkeitsbereich                 |
| commission_rate  | DECIMAL  | Provision in Prozent                  |

---

## 2. Beziehungen & Constraints

- Jeder `order` muss einen `sender` (Nutzer mit Rolle „sender“) referenzieren.
- Jeder `offer` gehört zu genau einem `order` und einem `driver`.
- Eine `transaction` tritt nur auf, wenn ein `offer` akzeptiert wurde.
- Jede `rating` ist einem Auftrag und zwei Nutzern zugeordnet (von / an).
- Ein `community_manager` ist einer Region fest zugewiesen.

---

## 3. Weitere Hinweise

- Alle `UUIDs` werden durch Supabase automatisch generiert (`uuid_generate_v4()`).
- `created_at` Felder nutzen den Default-Wert `now()`.
- Fremdschlüssel sind in Supabase automatisch mit Referenzschutz versehen.

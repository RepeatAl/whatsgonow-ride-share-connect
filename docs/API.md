
Whatsgonow API Specification

Diese Datei enthält neue Endpunkte, die im Rahmen des MVP und der Post-MVP-Roadmap implementiert wurden.  
Jede API-Sektion enthält eine kurze Beschreibung, Beispiel-Requests und Response-Schemata.

## Neue API-Endpunkte

---

### `GET /api/admin/dashboard`  
Übersicht für Admins mit KPIs, Nutzerzahlen und Regionendaten

**Beschreibung:**  
Gibt Admins eine Übersicht über Plattformmetriken wie Nutzerzahlen, Auftragseingänge, regionale Verteilungen und durchschnittliche Bewertung.

**Beispiel-Request:**
```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "total_users": 834,
  "total_orders": 1420,
  "active_regions": ["Berlin", "Hamburg", "München"],
  "average_rating": 4.7,
  "commission_this_month": 1287.50
}
```

---

### `POST /api/support/case`  
Nutzer meldet ein Problem oder startet eine Eskalation

**Beschreibung:**  
Erstellt einen neuen Supportfall, z. B. bei Problemen mit einer Lieferung, Zahlungsverzug oder Nutzerverhalten.

**Beispiel-Request:**
```http
POST /api/support/case  
Authorization: Bearer {user_token}  
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": "ab12cd34",
  "issue_type": "Lieferverzögerung",
  "message": "Mein Paket wurde nicht rechtzeitig abgeholt und ich erreiche den Fahrer nicht."
}
```

**Response (201 Created):**
```json
{
  "case_id": "support_98765",
  "status": "offen",
  "created_at": "2025-04-10T12:30:00Z"
}
```

---

### `GET /api/support/cases/:userId`  
Community Manager oder Admin ruft Supportfälle eines bestimmten Nutzers ab

**Beschreibung:**  
Ruft alle gemeldeten Supportfälle eines bestimmten Nutzers zur weiteren Bearbeitung oder Eskalation ab.

**Beispiel-Request:**
```http
GET /api/support/cases/12345
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
[
  {
    "case_id": "support_98765",
    "status": "offen",
    "issue_type": "Lieferverzögerung",
    "created_at": "2025-04-10T12:30:00Z"
  },
  {
    "case_id": "support_98766",
    "status": "geschlossen",
    "issue_type": "Zahlungsverzug",
    "created_at": "2025-04-08T09:10:00Z"
  }
]
```

---

### `PATCH /api/order/:orderId/return`  
Retourenprozess anstoßen

**Beschreibung:**  
Markiert eine Lieferung als retourniert und löst gegebenenfalls Folgeaktionen aus (z. B. Rückerstattung, neue Zustellung).

**Beispiel-Request:**
```http
PATCH /api/order/ab12cd34/return
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Empfänger nicht erreichbar",
  "comment": "Dreimaliger Zustellversuch ohne Erfolg."
}
```

**Response (200 OK):**
```json
{
  "order_id": "ab12cd34",
  "status": "retourniert",
  "updated_at": "2025-04-10T15:00:00Z"
}
```

---

### `GET /api/matching/geo`  
Routenbasierte Filterung nach Live-Position und Radius

**Beschreibung:**  
Gibt passende Transportaufträge auf Basis von GPS-Daten und Umkreis zurück.

**Beispiel-Request:**
```http
GET /api/matching/geo?lat=52.52&lng=13.405&radius=10
Authorization: Bearer {driver_token}
```

**Response (200 OK):**
```json
[
  {
    "order_id": "ab12cd34",
    "from": "Berlin",
    "to": "Potsdam",
    "distance_km": 8.2,
    "budget": 25
  },
  {
    "order_id": "cd34ef56",
    "from": "Berlin",
    "to": "Spandau",
    "distance_km": 7.4,
    "budget": 30
  }
]
```

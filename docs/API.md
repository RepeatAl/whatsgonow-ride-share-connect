# Whatsgonow API Specification

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
Community Manager oder Admin ruft Supportfälle eines Nutzers ab

**Beschreibung:**  
Gibt eine Liste aller bisherigen Supportfälle für einen bestimmten Nutzer zurück.

**Beispiel-Request:**
```http
GET /api/support/cases/user_12345
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
[
  {
    "case_id": "support_98765",
    "order_id": "ab12cd34",
    "issue_type": "Lieferverzögerung",
    "status": "offen",
    "created_at": "2025-04-10T12:30:00Z"
  }
]
```

---

### `PATCH /api/order/:orderId/return`  
Retourenprozess anstoßen (Testlauf)

**Beschreibung:**  
Löst einen Rückgabeprozess für eine Lieferung aus.

**Beispiel-Request:**
```http
PATCH /api/order/ab12cd34/return
Authorization: Bearer {user_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Ware beschädigt",
  "comment": "Die Verpackung war bei Übergabe offen."
}
```

**Response (200 OK):**
```json
{
  "return_id": "return_56789",
  "status": "eingeleitet",
  "created_at": "2025-04-10T14:45:00Z"
}
```

---

### `GET /api/matching/geo`  
Routenbasierte Filterung nach Live-Position und Radius

**Beschreibung:**  
Liefert passende Transportanfragen basierend auf aktueller Position und einem Suchradius.

**Beispiel-Request:**
```http
GET /api/matching/geo?lat=52.5200&lng=13.4050&radius=10
Authorization: Bearer {driver_token}
```

**Response (200 OK):**
```json
[
  {
    "order_id": "ord_001",
    "from_address": "Berlin",
    "to_address": "Potsdam",
    "distance_km": 28.4,
    "budget": 35.00
  }
]
```

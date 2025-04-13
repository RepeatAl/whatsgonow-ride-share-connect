# Matching & Geo-Filters – Whatsgonow

Dieses Dokument beschreibt die Matching-Logik sowie Geo-basierte Filtermechanismen, die das Herzstück der Whatsgonow-Plattform bilden. Ziel ist es, Angebot und Nachfrage für Transportaufträge möglichst präzise, schnell und nutzerfreundlich zu verbinden.

---

## 1. Matching-Logik

### 1.1 Grundprinzip
Das Matching erfolgt über ein hybrides System aus:

- **Routen- und Zeitfensterabgleich** (Live-Position vs. Wunschzeit)
- **Fahrzeugkapazität und Artikeldaten** (Größe, Gewicht)
- **Verfügbarkeiten des Fahrers** (Kalender, Präferenzen)
- **Dynamischem Angebot/Nachfrage-Index** (Beta)
- **Manueller Auswahl bei zu geringer Dichte**

### 1.2 Matching-Trigger
- Beim Anlegen eines Auftrags (Sender)
- Beim Starten der App (Fahrer)
- Bei Änderungen an Route, Status oder Position
- Bei Preisverhandlungen (Vorschläge aktualisieren)

---

## 2. Geobasierte Filterung

### 2.1 Live-Fahreranalyse (Beta)
Die Server-Funktion `/api/matching/geo` wertet regelmäßig Fahrerdaten aus:

- GPS-Position (alle 30s simuliert)
- Fahrtrichtung (aus Routenprofil)
- Fahrbereich (Radius, max. Umweg)

### 2.2 Response-Schema
```json
{
  "matched_orders": [
    {
      "order_id": "abc123",
      "pickup_location": "Berlin",
      "delivery_location": "Leipzig",
      "pickup_time_window": {
        "start": "2025-04-14T10:00:00Z",
        "end": "2025-04-14T12:00:00Z"
      },
      "estimated_match_score": 92.4
    }
  ]
}
```

### 2.3 Matching Score
Der Matching Score berechnet sich aus folgenden gewichteten Faktoren:

| Faktor                  | Gewichtung |
|-------------------------|------------|
| Zeitfensterüberschneidung | 40%       |
| Routenähnlichkeit        | 30%        |
| Auftragsbudget           | 15%        |
| Vergangenes Verhalten    | 10%        |
| Zufalls-/Fallbackfaktor  | 5%         |

---

## 3. Manuelle Modifikation

Fahrer können Vorschläge ignorieren oder blockieren. Dies wirkt sich auf künftige Rankings aus. Blockierte Sender erhalten keine Vorschläge mehr für diesen Fahrer.

---

## 4. Erweiterungen (Post-MVP)

- Heatmaps für Fahrerdichte
- Matching-Simulation in CM-Dashboard
- Priorisierte Aufträge (Boosting-System)
- KI-gestützte Voraussage hoher Nachfrage

---

**Letzte Änderung:** 2025-04-10

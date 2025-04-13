# Whatsgonow Analytics & Monitoring

Diese Datei dokumentiert die Analysestrategien, Tracking-Tools und Performance-Indikatoren der Plattform Whatsgonow. Ziel ist es, datengestützte Entscheidungen zu ermöglichen und die Nutzerzufriedenheit sowie Plattformstabilität kontinuierlich zu verbessern.

---

## 1. Tracking-Tools

| Tool           | Funktion                                | Status       |
|----------------|-----------------------------------------|--------------|
| Supabase Logs  | Backend-Logdaten & API-Monitoring       | ✅ Aktiv     |
| Supabase RLS   | Nutzung von Row-Level-Security Events   | ✅ Aktiv     |
| Vite Plugin    | Clientseitige Ladezeiten (Dev-Modus)    | ⚠️ Optional  |
| Cookie Consent | Opt-in Tracking für DSGVO-konforme Analysen | ✅ Aktiv |

---

## 2. Metriken & KPIs

### Nutzeraktivität

- **Tägliche/Wöchentliche aktive Nutzer (DAU/WAU)**
- Neue Registrierungen
- Abbrecherquote im Onboarding
- Login-Häufigkeit pro Region/Rolle

### Aufträge

- Erstellt vs. Abgeschlossen
- Durchschnittliche Matching-Zeit
- Häufigkeit von Stornierungen
- Preisverläufe und Budgetabweichungen

### Community & Support

- Verfügbare Community Manager pro Region
- Eröffnete Supportfälle pro Woche
- Durchschnittliche Lösungszeit
- Eskalationsquote

### Vertrauen & Bewertung

- Durchschnittliche Sternebewertung
- Verteilung 1–5 Sterne
- Anteil anonymisierter Kommentare
- Verifizierte Nutzer (KYC) vs. Gesamt

---

## 3. Ladezeiten & Performance

- ⏱️ Ziel: < **1,5 Sekunden**
- Analyse via Supabase Performance Tools
- Dashboard für Query Performance
- Heatmap clientseitiger Interaktionen (optional)

---

## 4. Monitoring Alerts

- Uptime-Alert via Supabase (99% Ziel)
- Query Failure Alerts bei 5xx Fehlern
- Eskalationsnotifikation an Admins bei >10 offenen Fällen
- Echtzeitstatus via Admin-Dashboard

---

## 5. Datenschutz & Analytics

- DSGVO-konform durch Cookie Opt-in
- Keine personenbezogenen Rohdaten im Tracking
- Anonymisierung via Session ID
- Datenhaltung ausschließlich in EU-Regionen

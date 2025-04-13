# Whatsgonow Architekturübersicht

Dieses Dokument beschreibt die technische Plattformarchitektur von Whatsgonow und orientiert sich an den Prinzipien der Modularität, Skalierbarkeit und Sicherheit. Es basiert auf dem SRS-Dokument und bildet die Grundlage für Entwicklung, Betrieb und Wartung.

---

## 1. Überblick

Die Plattform besteht aus vier Hauptkomponenten:
- **Frontend:** Clientseitige Anwendung für alle Nutzerrollen (Next.js mit TailwindCSS)
- **Backend:** Serverlogik mit Supabase (PostgreSQL, Auth, Edge Functions)
- **Matching Engine:** Regelbasierte und KI-gestützte Logik für Angebot/Nachfrage-Abgleich
- **Community Layer:** Regionale Steuerung und Monitoring durch Community Manager

---

## 2. Systemarchitektur

```plaintext
Browser/Client ─────────────┐
                            ▼
                   [ Next.js Frontend ]
                            │
                            ▼
                  [ Supabase Backend ]
                            │
      ┌─────────────────────┴────────────────────┐
      ▼                                           ▼
[ PostgreSQL DB ]                    [ Edge Functions & Auth ]
      │                                           │
      ▼                                           ▼
[ Matching Engine ]                [ Notification / Payment ]
```

---

## 3. Frontend

- **Technologien:** Next.js, TailwindCSS, ShadCN UI
- **Routing:** Clientseitig via React Router, API-Zugriff via Supabase JS SDK
- **Rollenabhängige Komponenten:** Login/Onboarding, Auftraggeber-, Fahrer- und CM-Dashboards
- **Responsive Design:** Optimiert für Mobilgeräte (PWA geplant)
- **Fehlerbehandlung:** Toast Notifications, Statusabfragen, Ladeindikatoren

---

## 4. Backend & Supabase

- **Datenbank:** PostgreSQL mit relationaler Struktur (siehe DB.md)
- **Authentifizierung:** Supabase Auth mit rollenbasierter Zugriffskontrolle
- **Edge Functions:** Auftragslogik, Zahlungsabwicklung, Konfliktmanagement
- **Realtime Features:** Matching, Chat, Tracking via Supabase Channels

---

## 5. Matching Engine

- **Eingabeparameter:** Geodaten, Zeitfenster, Gewicht, Preisgrenzen
- **Logik:** Entfernungsmatrix, zeitliche Machbarkeit, ML-Scoring (optional)
- **Ziel:** Vorschläge mit hoher Erfolgswahrscheinlichkeit anzeigen

---

## 6. Community & Admin Layer

- **Community Manager:** Zugriff auf Nutzer ihrer Region, Support- und Onboardingfunktionen
- **Admin Dashboard:** KPI-Übersicht, Nutzerverwaltung, Moderation
- **Monitoring:** Response-Zeit Tracking, Eskalationsstatus, Reports

---

## 7. Sicherheit & Datenschutz

- **DSGVO-konform:** Datenminimierung, Opt-in, Right-to-be-Forgotten
- **Transportverschlüsselung:** HTTPS, OAuth 2.0
- **Storage:** Supabase Storage mit Zugangskontrollen
- **Monitoring:** Supabase Performance Tools, automatisierte Warnungen bei Uptime-Verlust

---

## 8. Skalierbarkeit & Wartung

- **Horizontal skalierbar:** via Supabase Clustering und CDN
- **Infrastructure-as-Code:** über GitHub CI/CD Pipeline
- **Wartungsstrategie:** Rolling Deployments, Feature Flags, Error Logging

---

## 9. Erweiterbarkeit

- **Integrationen:** PayPal, KYC, Maps, Messaging
- **Modularisierung:** Erweiterung durch neue Rollen, Regionen, Features
- **APIs:** RESTful und WebSockets (siehe API.md)

---

Letzter Stand: April 2025
Erstellt von: Product & Architecture Team

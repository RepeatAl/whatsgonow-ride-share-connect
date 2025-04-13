# Whatsgonow Development Roadmap

Diese Datei beschreibt den zeitlichen Fahrplan für die Umsetzung des Whatsgonow MVP und nachgelagerter Funktionen. Die Roadmap basiert auf den funktionalen Anforderungen im SRS-Dokument.

---

## Phase 1: Foundation & Authentication (3 Wochen)

**Fokus:** Technische Basis und Nutzerverwaltung

**Deliverables:**
- Supabase Setup & DB-Schema
- Auth (Registrierung, Login, Rollen)
- CI/CD & GitHub Repo
- UI-Setup mit NextJS & TailwindCSS

**Milestones:**
✅ Nutzerregistrierung mit Rollen  
✅ Login + JWT Tokens  
✅ Profilbearbeitung möglich

---

## Phase 2: Core Matching Features (4 Wochen)

**Fokus:** Auftragslogik und Matching

**Deliverables:**
- Auftragserstellung (Sender)
- Routenplanung (Fahrer)
- Matching-Logik + Filteroptionen
- Angebotsabgabe (Fahrer)

**Milestones:**
✅ Sender können Aufträge erstellen  
✅ Fahrer sehen passende Matches  
✅ Angebote können eingereicht werden

---

## Phase 3: Deal & Tracking System (4 Wochen)

**Fokus:** Preisverhandlung & Live-Status

**Deliverables:**
- WebSockets für Echtzeit-Angebote
- Statusaktualisierung (Fahrer)
- Live-Tracking (GPS)
- In-App Benachrichtigungen

**Milestones:**
✅ Deal Mode mit Chatfunktion  
✅ GPS-Tracking funktioniert  
✅ Statuswechsel sichtbar für Sender

---

## Phase 4: Payments & Trust System (3 Wochen)

**Fokus:** Bezahlung & Vertrauenslogik

**Deliverables:**
- PayPal Integration (Zahlung reservieren + freigeben)
- QR-Code zur Übergabebestätigung
- Bewertungs- und Badgesystem

**Milestones:**
✅ Zahlung nur bei Deal-Bestätigung  
✅ QR-Scan schaltet Zahlung frei  
✅ Ratings sichtbar auf Profil

---

## Phase 5: Community & Final Polishing (2 Wochen)

**Fokus:** Manager-Tools & Optimierung

**Deliverables:**
- Dashboard für Community Manager
- Aktivitätsanalysen & KPIs
- UI-Finetuning
- Performance-Optimierungen

**Milestones:**
✅ CMs sehen regionale Aktivität  
✅ Plattform läuft stabil mit <1,5s Ladezeit  
✅ DSGVO-konform mit Monitoring

---

## Phase 6: Launch & Feedback Loop (2 Wochen)

**Fokus:** Go-Live, Nutzerfeedback und Tracking

**Deliverables:**
- Launch-Flag `LAUNCH_READY=true`
- Onboarding-Modals für Erstnutzer
- Feedback-System mit Button & Supportseiten
- FAQ- und Datenschutzseiten
- Cookie-Banner (DSGVO)
- Nutzungsanalysen & Monitoring via Supabase

**Milestones:**
✅ FAQ & Support erreichbar  
✅ Feedback-Button global eingebunden  
✅ Cookie Consent sichtbar & steuerbar  
✅ First-Use-Tracking aktiviert  
✅ Ladezeitüberwachung implementiert

---

## Post-MVP: Phase 7 – „Go Beyond“ (4 Wochen)

**Fokus:** Internationale Ausdehnung, Konfliktmanagement & Admin-Tools

**Deliverables:**
- Erweiterte Transportsuche (Live-Routenfilter + Geo-Distanz)
- Konfliktmanagement (Storno, Supportfall, Eskalation)
- Pilotregionen für Polen, Frankreich, Spanien freischalten
- In-App-Retourenprozess (Testlauf für Kundenschutz)
- Admin-Dashboard mit Echtzeit-KPIs, Nutzersteuerung und Moderation

**Milestones:**
✅ Neue Länder in Standortdatenbank aktiv  
✅ Routenbasierte Filter & Maps live  
✅ Supportfälle können dokumentiert & gelöst werden  
✅ Admin sieht Auftragseingänge, Ratings & KYC-Status  
✅ Retourenprozess UX getestet und dokumentiert

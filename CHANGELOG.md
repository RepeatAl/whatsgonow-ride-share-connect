
# Changelog

Alle wichtigen Änderungen am Projekt werden in dieser Datei dokumentiert.

## [2025-06-13] FAQ & Content Management Bereich final stabilisiert und gesperrt

### Hinzugefügt
- RLS-Policies für öffentlichen Zugriff auf Content-Tabellen (faq, faq_translations, legal_pages, legal_page_translations, footer_links, footer_link_translations)
- Public-safe Spracherkennung ohne Auth-Abhängigkeiten in useContentManagement.ts
- Error-State-Handling mit Fallback-UI in DynamicFAQ.tsx
- Auth-unabhängige URL-Navigation in DynamicLegalPage.tsx

### Verbessert
- FAQ-Seite funktioniert jetzt vollständig ohne Anmeldung (401-Fehler behoben)
- Alle Auth/Profile-Abhängigkeiten aus Content-Management entfernt
- Robuste Spracherkennung: URL-Parameter → Browser-Language → Fallback
- Verbesserte Error-Boundaries und Fallback-Mechanismen
- Stabilere Loading-States ohne Flimmern

### Behoben
- **KRITISCH**: 401-Fehler "permission denied for table profiles" in FAQ vollständig behoben
- RLS-Policies-Konflikte durch Public-Read-Access gelöst
- Auth-Schleifen in useLanguageMCP für anonyme Nutzer eliminiert
- Infinite-Query-Loops durch Auth-Context-Abhängigkeiten behoben

### Gesperrt
- src/hooks/useContentManagement.ts - **FINAL LOCKED**: Public-safe, Auth-unabhängig, RLS-kompatibel
- src/components/content/DynamicFAQ.tsx - **FINAL LOCKED**: Public-Mode, Error-Resilient, Stabil
- src/components/content/DynamicLegalPage.tsx - **FINAL LOCKED**: Auth-frei, URL-safe
- **Bereich ab sofort final gesperrt („locked-by-default")**. Änderungen nur nach CTO-Approval!

### Testing-Status
- ✅ FAQ-Seite lädt ohne 401-Fehler im anonymen Modus
- ✅ Keine Profile/Auth-Queries mehr in Content-Management
- ✅ Public RLS-Policies funktional getestet
- ✅ Mehrsprachigkeit ohne Auth-Context funktional

## [Unreleased]

### Hinzugefügt
- XRechnung-Unterstützung für elektronischen Rechnungsaustausch mit Behörden
- Edge Function `send-xrechnung-email` für automatischen XRechnung-Versand
- Validierungssystem für XRechnungs-Konformität und E-Mail-Versand
- Behördenerkennung für zielgerichteten XRechnung-Versand
- Komponente `OrderInvoiceXRechnungButton` für dedizierte XRechnung-Funktionalität
- Vorschaufunktion für XRechnungen zu Testzwecken

### Verbessert
- Integration der XRechnung-Funktionalität in bestehende Rechnungskomponenten
- Erweiterte Dokumentation zu XRechnung und elektronischem Rechnungsaustausch

## [0.1.0] - 2025-05-08

### Hinzugefügt
- GoBD-konforme Archivierungsfunktion via Edge Function `archive-invoices-schedule`
- Automatische Integritätsprüfung für Rechnungsdokumente mittels SHA-256 Hash
- Retention-Policy für rechtskonforme Dokumentenaufbewahrung

## [0.1.0] - 2025-05-06

### Hinzugefügt
- ErrorBoundary für bessere Fehlerbehandlung in der gesamten Anwendung
- Suspense-Handling für alle lazy-geladenen Routen
- Dokumentationsdateien für Entwicklung, Auth, Forms, Routing und Error Handling

### Geändert
- PreRegistrationForm in kleinere, wiederverwendbare Komponenten aufgeteilt:
  - PersonalInfoFields
  - RoleSelectionFields
  - GdprConsentField
- usePreRegistrationSubmit Hook extrahiert für separierte Business-Logik
- AppRoutes mit Suspense und Error Boundary umgeben
- Navigation von window.location.href zu React Router's navigate geändert

### Behoben
- Aktualisierungsproblem bei PreRegistrationForm durch Ersetzung direkter URL-Navigation
- Async-Loading-Probleme durch korrekte Suspense-Implementation

## [0.0.1] - 2025-04-01

### Hinzugefügt
- Initialisierung des Projekts
- Grundlegende Benutzeroberfläche
- Pre-Registration Formular


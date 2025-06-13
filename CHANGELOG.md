
# Changelog

Alle wichtigen Änderungen am Projekt werden in dieser Datei dokumentiert.

## [2025-06-13] FAQ & Content Management Bereich gesperrt

### Hinzugefügt
- Lock-Zertifikat für FAQ & Content Management Bereich
- Vollständige TypeScript-Stabilisierung in useContentManagement.ts
- Loading-State-Management ohne Flimmern in DynamicFAQ.tsx
- Mount-State-Handling für bessere Hydration
- Type Guards und Error Boundaries für alle FAQ-Funktionen

### Verbessert
- FAQ-Seite Flimmern vollständig behoben
- Explizite Return-Types für alle async Funktionen
- Konsistente Array-Returns und Fallback-Mechanismen
- Error-Handling mit graceful degradation
- Performance-Optimierung beim Laden der FAQ-Daten

### Gesperrt
- src/hooks/useContentManagement.ts - TypeScript-Safety, explizite Return-Types
- src/components/content/DynamicFAQ.tsx - Loading-Stabilität, Mount-Management
- Bereich ab sofort gesperrt („locked-by-default"). Änderungen nur nach CTO-Approval!

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

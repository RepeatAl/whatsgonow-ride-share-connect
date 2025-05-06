
# Changelog

Alle wichtigen Änderungen am Projekt werden in dieser Datei dokumentiert.

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

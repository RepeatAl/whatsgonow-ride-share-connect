
# Entwicklungsdokumentation

Diese Datei dient als zentrale Referenz für Entwicklungspraktiken und wichtige Änderungen im Projekt.

## Inhaltsverzeichnis
- [Überblick](#überblick)
- [Komponenten-Architektur](#komponenten-architektur)
- [Hooks](#hooks)
- [GoBD-Compliance](#gobd-compliance)
- [XRechnung-Unterstützung](#xrechnung-unterstützung)
- [Changelog](#changelog)

## Überblick
Die Anwendung ist als React-basierte Single Page Application mit React Router aufgebaut. 
Wesentliche Architekturprinzipien sind:
- Komponentenbasierter Aufbau mit klarer Trennung von Darstellung und Logik
- Custom Hooks für wiederverwendbare Logik
- Suspense-basiertes Lazy-Loading für optimierte Performance
- Fehlerbehandlung mittels ErrorBoundary-Komponenten

## Komponenten-Architektur
Wir folgen dem Prinzip kleiner, fokussierter Komponenten:
- Container-Komponenten verwalten den Zustand und übergeben diesen an Präsentations-Komponenten
- Formulare werden in kleinere, wiederverwendbare Komponenten aufgeteilt
- Routing-Logik ist zentral in AppRoutes.tsx organisiert

## Hooks
Custom Hooks werden für wiederverwendbare Logik eingesetzt, zum Beispiel:
- `usePreRegistrationSubmit`: Handhabt die Formular-Submission für die Voranmeldung
- `useAuthSession`: Verwaltet den Authentifizierungsstatus

## GoBD-Compliance
Die Anwendung implementiert GoBD-konforme Archivierung für Rechnungen:
- Die Edge Function `archive-invoices-schedule` prüft und archiviert Rechnungen automatisch
- SHA-256 Hashing für Dokumentenintegrität und Unveränderbarkeit
- Audit-Logs für alle Archivierungsvorgänge in `invoice_audit_log`
- Automatische Prüfung der Hash-Konsistenz zur Sicherstellung der Unveränderbarkeit
- Retention-Policies mit konfigurierbaren Aufbewahrungsfristen (Standard: 10 Jahre)

Die Funktion verarbeitet Rechnungen mit dem Status 'sent' und setzt deren Status auf 'gobd_compliant'.

## XRechnung-Unterstützung
Die Anwendung unterstützt den elektronischen Rechnungsaustausch mit Behörden gemäß XRechnung-Standard:
- Automatische Erkennung von Behörden anhand der E-Mail-Domain
- Generierung von XRechnung-konformen XML-Dokumenten
- Versand von XRechnungen via Edge Function `send-xrechnung-email`
- Validierung der XRechnung-Konformität vor dem Versand
- Vorschaufunktion für Testzwecke
- Auditlogging aller XRechnung-Operationen

Die Funktionalität ist nahtlos in die bestehende Rechnungs-Komponenten integriert und bietet eine spezialisierte UI für XRechnung-Operationen.

## Changelog
### 2025-05-06: Major Refactoring
- PreRegistrationForm in kleinere Komponenten aufgeteilt
- Suspense-Handling für verzögerte Komponenten implementiert
- ErrorBoundary für bessere Fehlerbehandlung hinzugefügt

### 2025-05-08: GoBD-Compliance
- Edge Function `archive-invoices-schedule` für automatische Rechnungsarchivierung implementiert
- SHA-256 Hashing für Dokumenten-Integritätsprüfung eingeführt
- Retention-Policy und Löschzeitpunkt-Management implementiert

### 2025-05-10: XRechnung-Support
- Edge Function `send-xrechnung-email` für den Versand von elektronischen Rechnungen an Behörden implementiert
- Automatische Behördenerkennung für zielgenauen XRechnung-Versand
- Vorschaufunktionalität für Testzwecke hinzugefügt
- XRechnung-spezifische UI-Komponenten für verbesserte Benutzerfreundlichkeit

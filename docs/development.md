
# Entwicklungsdokumentation

Diese Datei dient als zentrale Referenz für Entwicklungspraktiken und wichtige Änderungen im Projekt.

## Inhaltsverzeichnis
- [Überblick](#überblick)
- [Komponenten-Architektur](#komponenten-architektur)
- [Hooks](#hooks)
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

## Changelog
### 2025-05-06: Major Refactoring
- PreRegistrationForm in kleinere Komponenten aufgeteilt
- Suspense-Handling für verzögerte Komponenten implementiert
- ErrorBoundary für bessere Fehlerbehandlung hinzugefügt

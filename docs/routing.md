
# Routing-System

Diese Dokumentation beschreibt das Routing-System der Anwendung.

## Architektur

### AppRoutes Komponente
Die zentrale Routing-Komponente `AppRoutes.tsx` orchestriert alle Routen der Anwendung:
- Verwendet React Router für clientseitiges Routing
- Implementiert Suspense für verzögertes Laden von Komponenten
- Bietet Fehlerbehandlung über ErrorBoundary

### Routenkonfiguration
Routen werden in `routes.tsx` definiert mit folgenden Eigenschaften:
- `path`: URL-Pfad
- `element`: React-Komponente, die gerendert wird
- `public`: Flag für öffentliche Routen ohne Authentifizierung
- `protected`: Flag für geschützte Routen, die Authentifizierung erfordern
- `children`: Verschachtelte Routen (optional)

### Lazy Loading
- Alle Seitenkomponenten werden mit `React.lazy()` importiert
- Dies verbessert die initiale Ladezeit durch Code-Splitting
- Suspense-Fallbacks zeigen Ladestatus während des Ladens

### Implementierungsdetails
- `<Suspense>` umschließt alle Routen für optimiertes Laden
- `<ErrorBoundary>` fängt Fehler während des Ladens ab
- `<ProtectedRoute>` prüft Authentifizierungsstatus
- `<PublicRoute>` für öffentlich zugängliche Seiten

## Navigationsmuster
- Verwendung von React Router's `<Link>` und `useNavigate()` statt direkter URL-Manipulation
- Dies verhindert vollständige Seitenaktualisierungen und verbessert die Nutzererfahrung

## Best Practices
- Immer `navigate()` statt `window.location.href` verwenden
- Jede Seite sollte eine eigene Suspense-Grenze haben
- Fehlerbehandlung durch ErrorBoundary sicherstellen

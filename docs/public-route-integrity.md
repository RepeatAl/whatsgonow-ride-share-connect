
# Public Route Integrity Guide

## Übersicht
Dieses Dokument erklärt den Zusammenhang zwischen verschiedenen Komponenten, die für die korrekte Erkennung und Behandlung öffentlicher Routen verantwortlich sind.

## Kernkomponenten

### 1. `src/routes/publicRoutes.ts`
- **Zweck**: Definiert, welche Routen öffentlich zugänglich sind ohne Authentifizierung
- **Hauptfunktion**: `isPublicRoute(path: string): boolean` 
- **Besonderheiten**: 
  - Berücksichtigt Sprachpräfixe (/de/, /en/, /ar/)
  - Unterstützt sowohl exakte Pfade als auch Pfadmuster
  - Ist die zentrale Wahrheitsquelle für öffentliche Routen

### 2. `src/components/routing/PublicRoute.tsx`
- **Zweck**: React-Komponente für öffentliche Seitenrouten
- **Funktionsweise**:
  - Verwendet `isPublicRoute()` zur Prüfung des aktuellen Pfades
  - Erlaubt öffentliche Routen ohne Auth-Prüfung
  - Leitet authentifizierte Benutzer von Loginseiten weiter
- **Wichtig**: Enthält keine hartkodierten Routen, sondern nutzt immer `isPublicRoute()`

### 3. `src/contexts/SimpleAuthContext.tsx`
- **Zweck**: Stellt Auth-Kontext für die Anwendung bereit
- **Kritische Funktion**: 
  - Sorgt für frühen Return mit `isPublicRoute(path)`, bevor Weiterleitungslogik ausgeführt wird
  - Verhindert unerwünschtes Redirecten von öffentlichen Routen zu Login
- **Reihenfolge wichtig**: `isPublicRoute()` muss VOR jeder anderen Prüfung aufgerufen werden

## Öffentliche Spezialseitentypen
1. **Landing Page** (`/`, `/de`, `/en`, `/ar`)
   - Muss Videos korrekt laden ohne Auth
   - Sprache wird korrekt erkannt und angewandt
   
2. **HERE Maps Demo** (`/here-maps-demo`, `/de/here-maps-demo` etc.)
   - Kartenintegration und Diagnose muss ohne Login funktionieren
   - API-Key-Zugriff über Supabase Functions ist öffentlich

## Video und Media Loading
Die `VideoPlayerWithAnalytics`-Komponente hängt von korrekten Pfaden ab:
- `src` muss richtig übergeben werden
- Routing darf Komponente nicht vor korrekter Initialisierung abbrechen
- Logs helfen bei der Diagnose, wenn Videos nicht laden

## Testen öffentlicher Routen
1. Immer in Inkognito-Modus testen (keine Auth-Cookies)
2. Teste alle Sprachvarianten (`/de`, `/en`, `/ar`)
3. Achte auf vollständiges Laden aller Medien und API-Ressourcen
4. Vergewissere dich, dass keine Login-Weiterleitungen erfolgen

## Gemeinsame Fehlerszenarien
1. **SimpleAuthContext ignoriert öffentliche Routen**
   - Symptom: Endlosweiterleitung zu Login bei öffentlichen Seiten
   - Fix: `isPublicRoute()` als erste Prüfung vor Weiterleitungslogik
   
2. **Video/HERE Maps laden nicht**
   - Symptom: Komponente wird gemountet aber API-Calls/Media-Loading fehlschlagen
   - Fix: Sicherstellen, dass Routen nicht unterbrochen werden und src korrekt ist

## Wartung
Bei Hinzufügen neuer öffentlicher Seiten:
1. Füge den Pfad zu `PUBLIC_ROUTES` in `publicRoutes.ts` hinzu
2. Teste die Route in allen Sprachvarianten
3. Stelle sicher, dass alle Medien und API-Ressourcen korrekt geladen werden


# Internationalisierung & Sprachpräferenz in Whatsgonow

Diese Dokumentation beschreibt die Implementierung des Mehrsprachigkeits-Systems in der Whatsgonow-Plattform.

## Übersicht

Das System ermöglicht:
- Dynamischen Sprachwechsel mit URL-Sprachpräfix (z.B. `/de/dashboard`)
- Automatische Erkennung und Anwendung der Nutzerpräferenzen
- Persistenz der Spracheinstellung im Browser und Nutzerprofil
- Konsistentes Verhalten über Login/Logout-Grenzen hinweg
- Fehlertoleranz gegenüber ungültigen Sprachcodes

## Sprachpräferenz-Priorisierung

Die Sprache wird in folgender Reihenfolge ermittelt (höchste Priorität zuerst):

1. **Explizite Auswahl des Nutzers** via `LanguageSwitcher`
2. **Gespeicherte Sprache im Nutzerprofil** (bei eingeloggten Benutzern)
3. **Sprachpräfix in der URL** (z.B. `/pl/landing`)
4. **Browser-Sprache** (`navigator.language`), sofern implementiert
5. **Fallback: `de`** (nur wenn keine andere Option verfügbar)

## Technische Implementierung

### Speicherung & Persistenz

- **LocalStorage**: Im Browser als `i18nextLng`
- **Supabase**: In der `profiles`-Tabelle als `language`-Feld
- **URL**: Als erstes Segment im Pfad (z.B. `/en/dashboard`)

### Synchronisierung

- Bei **Login**: Sprachpräferenz aus dem Nutzerprofil wird geladen
- Bei **Logout**: Sprachpräferenz bleibt auf der explizit gewählten oder Browsersprache
- Bei **Sprachwechsel im Interface**: Wird in localStorage und (bei eingeloggten Nutzern) im Profil gespeichert
- Bei **Direktaufruf einer URL**: Sprachcode wird extrahiert und gesetzt

### URL-Handling & Routing

Alle URLs enthalten ein Sprachpräfix:
- Interne Links werden mit dem aktuellen Sprachpräfix generiert
- URLs ohne Sprachpräfix werden automatisch zur passenden Sprachroute umgeleitet
- Bei ungültigem Sprachcode erfolgt Umleitung zur besten verfügbaren Sprache

### Kern-Komponenten

- **`LanguageProvider`**: Zentraler Context für Sprachzustand und -methoden
- **`EnhancedLanguageRouter`**: Verwaltet sprachbezogenes Routing und Redirects
- **`LanguageSwitcher`**: UI-Komponente zum Wechseln der Sprache
- **`useLanguage`**: Hook für den Zugriff auf Sprachfunktionen in Komponenten

### Utility-Funktionen

- **`getLocalizedUrl(path, lang?)`**: Erzeugt URL mit korrektem Sprachpräfix
- **`setLanguageByCode(code, storeInProfile?)`**: Ändert die aktuelle Sprache
- **`determineBestLanguage(browserLang?, storedLang?, userProfileLang?)`**: Ermittelt beste Sprache
- **`validateLanguagePath(path)`**: Überprüft URL auf gültigen Sprachcode

## Fehlerbehandlung

- **Ungültiger Sprachcode**: Automatischer Redirect zur besten verfügbaren Sprache
- **Nicht implementierte Sprache**: Warnung für Entwickler und Fallback zu implementierter Sprache
- **URL ohne Sprachpräfix**: Automatische Umleitung mit Sprachpräfix

## Entwickler-Hinweise

### Neue Sprachen Hinzufügen

1. Ergänze die Sprache in `src/config/supportedLanguages.ts`
2. Erstelle die Übersetzungsdateien in `src/i18n/locales/[lang]/`
3. Setze `implemented: true`, wenn alle Übersetzungen vollständig sind

### Verwendung im Code

```tsx
// Zugriff auf Sprachfunktionen
const { currentLanguage, getLocalizedUrl } = useLanguage();

// Generieren eines lokalisierten Links
<Link to={getLocalizedUrl('/dashboard')}>Dashboard</Link>

// Expliziter Sprachwechsel
setLanguageByCode('en', true); // true = im Profil speichern
```

### Integration mit Supabase-Profilen

Die Sprachpräferenz wird automatisch mit dem Nutzerprofil in Supabase synchronisiert:
- Beim Login wird die Sprache aus dem Profil geladen
- Bei explizitem Sprachwechsel wird das Profil aktualisiert
- Bei neuem Nutzer wird die aktuelle Sprache im Profil gespeichert

## Testen

- Testfall 1: Erstbesuch ohne Sprachpräferenz → Browser-Sprache oder de
- Testfall 2: Explizite Sprachauswahl → bleibt über Navigation erhalten
- Testfall 3: Login/Logout → Sprachpräferenz wird korrekt übernommen/beibehalten
- Testfall 4: Ungültiger Sprachcode → Umleitung + Warnung

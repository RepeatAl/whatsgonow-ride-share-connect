
# HERE Maps Integration - Datenschutz & Implementierung

## Überblick

Die Whatsgonow-Plattform integriert HERE Maps als externen Kartendienst zur Darstellung von Transportangeboten. Diese Integration erfolgt vollständig DSGVO-konform mit expliziter Nutzereinwilligung.

## Architektur

### Consent-Management

```
User besucht Seite
    ↓
Consent-Status prüfen (localStorage)
    ↓
Wenn unbekannt: MapConsentBanner anzeigen
    ↓
User entscheidet: Akzeptieren/Ablehnen
    ↓
Consent in localStorage speichern
    ↓
Bei Akzeptanz: HERE Maps laden
Bei Ablehnung: Fallback-Content anzeigen
```

### Datenfluss

1. **Ohne Consent:** Keine Verbindung zu HERE Maps
2. **Mit Consent:** IP-Adresse und Browser-Daten werden an HERE übertragen
3. **Karten-Interaktionen:** Zoom, Pan, Clicks werden von HERE verarbeitet
4. **Whatsgonow speichert:** Nur den Consent-Status (localStorage)

## Komponenten

### 1. MapConsentBanner.tsx
- Zeigt DSGVO-konforme Einwilligungsabfrage
- Erklärt Datenverarbeitung transparent
- Bietet Akzeptieren/Ablehnen Optionen
- Speichert Entscheidung in localStorage

### 2. LiveMapSection.tsx
- Prüft Consent-Status
- Lädt HERE Maps nur bei Zustimmung
- Zeigt Fallback bei Ablehnung
- Ermöglicht Consent-Änderung

### 3. MapPolicy.tsx
- Detaillierte Erklärung der HERE Maps Integration
- Auflistung verarbeiteter Daten
- Hinweise zu Nutzerrechten
- Widerruf-Funktionalität

### 4. StableHereMapWithData.tsx
- Sichere HERE Maps Integration
- Lädt nur bei vorhandenem Consent
- Robuste Fehlerbehandlung
- Mehrsprachige Unterstützung

## Rechtliche Compliance

### DSGVO-Anforderungen
- ✅ Explizite Einwilligung vor Datenübertragung
- ✅ Transparente Information über Datenverarbeitung
- ✅ Einfacher Widerruf der Einwilligung
- ✅ Funktionalität ohne Consent verfügbar (Fallback)

### TTDSG-Anforderungen
- ✅ Keine Cookies ohne Einwilligung
- ✅ localStorage nur für Consent-Management
- ✅ Keine Tracking-Technologien

### Dokumentation
- ✅ Datenschutzerklärung erweitert
- ✅ Separate Map-Policy verfügbar
- ✅ Technische Dokumentation vorhanden

## Technische Details

### Consent Storage
```javascript
// Consent-Status speichern
localStorage.setItem('whatsgonow-map-consent', 'accepted|declined')
localStorage.setItem('whatsgonow-map-consent-date', timestamp)

// Consent-Status prüfen
const consent = localStorage.getItem('whatsgonow-map-consent')
```

### Fallback-Mechanismus
Bei fehlendem Consent wird eine alternative Ansicht angezeigt:
- Erklärung der Datenschutz-Entscheidung
- Alternative Navigationsmöglichkeiten
- Option zur Consent-Änderung

### Mehrsprachigkeit
Alle Consent-Texte sind internationalisiert:
- Deutsche Texte (primär)
- Englische Texte (sekundär)
- Erweiterbar für weitere Sprachen

## Implementierung

### 1. Consent-Banner Integration
```tsx
{mapConsent === null && (
  <MapConsentBanner onConsent={handleConsent} />
)}
```

### 2. Conditional Map Loading
```tsx
{mapConsent === true && (
  <StableHereMapWithData />
)}
```

### 3. Fallback Content
```tsx
{mapConsent === false && (
  <MapFallbackContent />
)}
```

## Testing

### Consent-Flow testen
1. Seite ohne gespeicherten Consent besuchen
2. Banner sollte erscheinen
3. "Akzeptieren" → Karte lädt
4. "Ablehnen" → Fallback wird angezeigt
5. Page Refresh → Entscheidung bleibt gespeichert

### Widerruf testen
1. Map-Policy Seite besuchen
2. "Einwilligung widerrufen" klicken
3. Consent wird gelöscht
4. Bei nächstem Kartenbesuch: Banner erscheint erneut

## Monitoring

### Metriken
- Consent-Rate (Akzeptanz vs. Ablehnung)
- Map-Usage nach Consent
- Fallback-Nutzung
- Widerruf-Rate

### Logs
```javascript
console.log('Map consent:', consent)
console.log('HERE Maps SDK loaded:', sdkReady)
console.log('Map initialized:', mapReady)
```

## Migration

Diese Integration ist **non-breaking**:
- Bestehende Map-Komponenten funktionieren weiter
- Consent wird schrittweise eingeführt
- Fallback gewährleistet Funktionalität
- Keine Datenbank-Änderungen erforderlich

## Support

### Nutzer-FAQ
- "Warum sehe ich die Karte nicht?" → Consent-Erklärung
- "Wie kann ich die Karte aktivieren?" → Consent erteilen
- "Wie widerrufe ich meine Zustimmung?" → Map-Policy Seite

### Admin-Tools
- Consent-Statistiken im Admin-Dashboard
- Debugging-Tools für Map-Loading
- Fehlerverfolgung bei HERE Maps API

## Roadmap

### Phase 2.4 (geplant)
- Guest-Upload Marker auf Karte
- Erweiterte Consent-Optionen
- Performance-Optimierungen

### Zukünftige Erweiterungen
- Alternative Kartenanbieter
- Offline-Karten-Fallback
- Erweiterte Datenschutz-Controls

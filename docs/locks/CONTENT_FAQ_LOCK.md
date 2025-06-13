
# Lock-Zertifikat: FAQ & Content Management Bereich

**Gesperrt seit:** 2025-06-13
**Updated:** 2025-06-13 - NOTFALL-ISOLATION implementiert
**Locked by:** CTO Christiane

## Betroffene Dateien:
### LOCKED (keine Änderungen ohne CTO-Approval):
- src/hooks/useContentManagement.ts
- src/components/content/DynamicFAQ.tsx
- src/components/content/DynamicLegalPage.tsx

### NEU ISOLIERT (STANDALONE, NO-GLOBALS-REGEL):
- src/pages/StaticFaq.tsx
- src/components/content/StaticFaqComponent.tsx  
- src/components/content/StaticFaqData.ts

## KRITISCHE ÄNDERUNG - NOTFALL-ISOLATION:
**Problem:** Global Context Contamination verursachte 401-Fehler durch versteckte Profile-Queries
**Lösung:** Vollständige Isolation implementiert

### ✅ StaticFaq ist jetzt 100% STANDALONE:
- **KEINE globalen Context-Imports** (LanguageMCP, i18n, Provider)
- **KEINE Auth-Dependencies** - komplett Public-safe
- **Eigene Spracherkennung** via URL/Browser/localStorage (isoliert)
- **Statische Daten** während Stabilisierung
- **Zero Profile/Auth-Requests** garantiert

### 🚨 NO-GLOBALS-REGEL für FAQ-Bereich:
- ❌ **VERBOTEN:** Imports aus main.tsx, App.tsx, globalen Contexts
- ❌ **VERBOTEN:** LanguageMCP, OptimizedLanguageProvider, i18n-Context
- ❌ **VERBOTEN:** Alle globalen Provider oder Context-Dependencies  
- ❌ **VERBOTEN:** Auth/Profile-Queries (auch versteckte)
- ✅ **ERLAUBT:** Nur lokale, isolierte Logik und direkte Supabase-Calls

## Technische Implementierung:
### StaticFaq.tsx:
- Komplett standalone Page ohne Layout/Provider-Wrapper
- Eigene Helmet-SEO, eigene Spracherkennung
- ZERO Dependencies zu globalen Contexts

### StaticFaqComponent.tsx:
- Isolierte Spracherkennung via getSimpleLanguage()
- Keine i18n/LanguageMCP-Imports
- Lokales State-Management, eigene Übersetzungen

### StaticFaqData.ts:
- Statische FAQ-Daten (DE/EN) 
- Fallback-ready für weitere Sprachen
- Keine DB-Dependencies während Isolation

## Routing:
- `/faq` und `/:lang/faq` → StaticFaq (isoliert)
- `/dynamic/faq` → DynamicFaq (für Vergleichstests)

## Testing-Kriterien:
- ✅ Network-Panel: ZERO /profiles, /auth, /user-Requests
- ✅ Incognito-Modus: FAQ lädt ohne 401-Fehler
- ✅ Mehrsprachigkeit funktional ohne globale Context
- ✅ Keine Console-Errors bei Anonymous-Access

## Status nach Isolation:
- **FAQ ist PUBLIC-FIRST:** Funktioniert ohne Login/Auth
- **Kontamination beseitigt:** Keine globalen Context-Abhängigkeiten
- **Zukunftssicher:** Standalone-Architektur für alle weiteren FAQ-Features
- **CTO-Lock:** Änderungen nur nach schriftlicher Freigabe

## Nächste Schritte (nur nach CTO-Approval):
1. Supabase-Integration wieder einbauen (ABER isoliert, nicht global)
2. Erweiterte Mehrsprachigkeit (ohne globale Provider)
3. Dynamische Content-Features (standalone)

---
**REGEL:** FAQ-Bereich bleibt für immer STANDALONE - NO GLOBALS, NO CONTEXTS, NO AUTH-DEPENDENCIES!
**WICHTIG:** Diese Isolation schützt das FAQ-Modul vor zukünftigen globalen Architektur-Änderungen.

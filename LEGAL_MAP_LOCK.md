
# LOCK: Legal, Footer & Karten-Consent (Stand 13.06.2025)

Diese Bereiche sind ab sofort „eingefroren":

## Gesperrte Dateien

- `src/components/Footer.tsx`
- `src/pages/Legal.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/Impressum.tsx`
- `src/components/map/StableHereMapWithData.tsx`
- `src/components/home/LiveMapSection.tsx`
- `src/components/map/MapConsentBanner.tsx`
- `src/hooks/useMapConsent.ts` **[NEU - 13.06.2025]**
- `src/components/ConsentBanner.tsx` **[ERWEITERT - 13.06.2025]**

## 🚨 CRITICAL REPAIR LOG (13.06.2025)

**DSGVO-VERSTOSSE BEHOBEN - CTO SOFORT-REPARATUR**

### Identifizierte Probleme:
1. **KRITISCH:** Karte lud automatisch bei wiederholten Besuchen ohne erneute Zustimmung
2. **KRITISCH:** MapConsentBanner löste automatisch `onConsent(true)` aus localStorage aus
3. **KRITISCH:** LiveMapSection stellte Consent automatisch wieder her
4. **KRITISCH:** Keine strikte Dreiwerte-Logic (null/false/true)

### Durchgeführte Reparaturen:

#### 1. useMapConsent Hook (NEU)
- **Datei:** `src/hooks/useMapConsent.ts`
- **Änderung:** Zentrale Consent-Verwaltung mit strikter Dreiwerte-Logik
- **CRITICAL:** Initial state ist IMMER `null` (Banner zeigen)
- **CRITICAL:** Keine automatische localStorage-Wiederherstellung
- **CRITICAL:** Consent nur nach explizitem Button-Click

#### 2. MapConsentBanner.tsx (REPARIERT)
- **Datei:** `src/components/map/MapConsentBanner.tsx`
- **CRITICAL FIX:** Entfernung der automatischen `onConsent(true)` Trigger (Zeilen 23-27)
- **CRITICAL FIX:** Banner wird IMMER gezeigt bis expliziter Button-Click
- **CHANGE:** Props geändert von `onConsent` zu `onAccept`/`onDecline`
- **FIX:** Link zu `/privacy-policy` korrigiert

#### 3. LiveMapSection.tsx (GEHÄRTET)
- **Datei:** `src/components/home/LiveMapSection.tsx`
- **CRITICAL FIX:** Echte Conditional Imports - Map nur in `if (isMapAllowed === true)` Block
- **CRITICAL FIX:** Keine automatische Consent-Wiederherstellung aus localStorage
- **CRITICAL FIX:** Fallback als Standard-Zustand
- **NEU:** Widerruf-Button im Fallback-Content
- **NEU:** useMapConsent Hook Integration

#### 4. ConsentBanner.tsx (ERWEITERT)
- **Datei:** `src/components/ConsentBanner.tsx`
- **ERWEITERT:** Granulare Consent-Optionen (Essential, Analytics, Map)
- **ERWEITERT:** Tab-Interface für detaillierte Einstellungen
- **FIX:** Footer-Links zu `/privacy-policy` und `/impressum`
- **NEU:** Map-Consent-Integration in globales GDPR-Management

## Änderungsrichtlinien

**🚨 WICHTIG:** Jede Änderung an den oben genannten Dateien erfordert:

1. **Schriftliche CTO-Freigabe** vor jeder Änderung
2. **Commit-Tag [CTO-APPROVED]** für alle betroffenen Commits
3. **Dokumentation** im Changelog/Audit-Log
4. **Review-Pflicht** für alle Pull Requests, die diese Dateien betreffen
5. **E2E-Test** für Map-Consent-Flow nach jeder Änderung

## Verstöße

-Commits ohne CTO-Freigabe werden automatisch rückgängig gemacht
- Verstöße werden im Audit-Log dokumentiert
- Wiederholte Verstöße führen zu Repository-Beschränkungen

## Grund für Lock

Diese Dateien enthalten:
- Rechtlich bindende Informationen (Impressum, AGB, Datenschutz)
- DSGVO-kritische Consent-Logik für externe Services
- Compliance-relevante Footer-Links
- Stabile Kontaktdaten und Unternehmensangaben

## DSGVO-COMPLIANCE STATUS

### ✅ REPARIERT (13.06.2025):
- Map lädt NIE automatisch ohne expliziten Button-Click
- Strikte Dreiwerte-Consent-Logic implementiert
- Automatische localStorage-Wiederherstellung entfernt
- Banner wird immer gezeigt bis explizite Entscheidung
- Fallback-Mechanismus bei Ablehnung implementiert
- Widerruf-Funktionalität integriert

### 🧪 ERFORDERLICHE TESTS:
1. **localStorage leeren** → Seite laden → Banner muss erscheinen
2. **"Karte anzeigen" klicken** → Map lädt → Banner verschwindet
3. **Seite neu laden** → Banner muss WIEDER erscheinen
4. **"Ablehnen" klicken** → Fallback-Content → Kein HERE Maps Request
5. **Widerruf testen** → Consent löschen → Banner erscheint erneut

## Ausnahmen

Nur folgende Änderungen sind OHNE CTO-Freigabe erlaubt:
- Reine Übersetzungen (i18n-Keys)
- Fehlerbehebungen bei Typos in nicht-rechtlichen Texten
- Styling-Änderungen ohne Inhaltsbezug

## Audit-Prozess & Changelog

**Jede Änderung an Locked-Dateien MUSS:**
- Im Changelog dokumentiert werden
- Einen CTO-Approval-Nachweis enthalten
- Den Grund der Änderung explizit beschreiben
- Rückgängig gemacht werden können (Rollback-Plan)
- E2E-Test für Map-Consent-Flow durchlaufen

## Kontakt

Bei Fragen zum Lock-Status: Christiane (CTO)

**Status: 🔄 UNDER REPAIR (13.06.2025)**
- ❌ Kritische DSGVO-Verstöße identifiziert und repariert
- ✅ Consent-Logic komplett neu implementiert
- 🧪 E2E-Tests erforderlich vor CTO-Freigabe
- 📋 Dokumentation vollständig aktualisiert

## E2E-TEST CHECKLIST

**VOR CTO-FREIGABE zu testen:**

| Test | Status | Beschreibung |
|------|--------|-------------|
| ☐ | Pending | localStorage leeren → Seite laden → Banner erscheint |
| ☐ | Pending | "Karte anzeigen" → Map lädt → Banner weg |
| ☐ | Pending | Page Refresh → Banner erscheint WIEDER |
| ☐ | Pending | "Ablehnen" → Fallback angezeigt → Kein HERE Request |
| ☐ | Pending | Widerruf-Button → Consent gelöscht → Banner wieder da |
| ☐ | Pending | Network Tab: Keine HERE Requests ohne expliziten Click |
| ☐ | Pending | Mobile & Desktop Test |
| ☐ | Pending | Alle Browser (Chrome, Firefox, Safari) |

**CTO-FREIGABE NUR NACH VOLLSTÄNDIGEM ✅ ALLER TESTS!**

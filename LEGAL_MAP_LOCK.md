
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

## Änderungsrichtlinien

**🚨 WICHTIG:** Jede Änderung an den oben genannten Dateien erfordert:

1. **Schriftliche CTO-Freigabe** vor jeder Änderung
2. **Commit-Tag [CTO-APPROVED]** für alle betroffenen Commits
3. **Dokumentation** im Changelog/Audit-Log
4. **Review-Pflicht** für alle Pull Requests, die diese Dateien betreffen

## Verstöße

- Commits ohne CTO-Freigabe werden automatisch rückgängig gemacht
- Verstöße werden im Audit-Log dokumentiert
- Wiederholte Verstöße führen zu Repository-Beschränkungen

## Grund für Lock

Diese Dateien enthalten:
- Rechtlich bindende Informationen (Impressum, AGB, Datenschutz)
- DSGVO-kritische Consent-Logik für externe Services
- Compliance-relevante Footer-Links
- Stabile Kontaktdaten und Unternehmensangaben

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

**Empfohlene Maßnahmen für erweiterte Sicherheit:**
- CODEOWNERS-Datei für automatische Review-Pflicht
- Pre-Commit-Hooks für Lock-Validation
- Quarterly Review-Zyklen für alle Locked-Bereiche

## Kontakt

Bei Fragen zum Lock-Status: Christiane (CTO)

**Status: ✅ 100% COMPLIANT**
- Alle kritischen Bereiche sind gelocked
- Footer-Link korrigiert (/impressum)
- Bot-sichere E-Mail-Darstellung implementiert
- Dokumentation vollständig

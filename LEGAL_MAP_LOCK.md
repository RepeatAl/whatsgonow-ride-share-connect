
# LOCK: Legal, Footer & Karten-Consent (Stand 13.06.2025)

Diese Bereiche sind ab sofort „eingefroren":

## Gesperrte Dateien

- `src/components/Footer.tsx`
- `src/pages/Legal.tsx`
- `src/pages/PrivacyPolicy.tsx`
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

## Kontakt

Bei Fragen zum Lock-Status: Christiane (CTO)

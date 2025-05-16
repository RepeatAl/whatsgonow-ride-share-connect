
# Moderation & Community Governance

Dieses Dokument beschreibt die geplanten Funktionen zur Moderation von Inhalten, Nutzerverhalten und Community-Richtlinien auf der Whatsgonow-Plattform.

---

## Ziele

- Schutz der Community vor Missbrauch, Spam und unangemessenem Verhalten
- Unterstützung durch menschliche Moderatoren und Community Manager
- Skalierbare Eskalationsmechanismen für Supportfälle

---

## Rollen & Verantwortlichkeiten

| Rolle              | Berechtigung                                                                 |
|--------------------|------------------------------------------------------------------------------|
| **Admin**          | Vollzugriff auf alle Moderationsfunktionen, Nutzerverwaltung                 |
| **Community Manager** | Zugriff auf Nutzer und Inhalte in eigener Region, Eingriff bei Konflikten     |
| **Support Team**   | Zugriff auf eskalierte Fälle, Rückerstattungen, Einträge im Nutzerkonto      |

---

## Moderationsfunktionen

### 1. Nutzer melden

- Jeder registrierte Nutzer kann Nachrichten, Angebote oder Profile melden
- Meldungstypen: unangemessen, beleidigend, Spam, Betrug, verdächtiges Verhalten

### 2. Nutzer-Flagging System

#### a) Funktion und Zweck
- Community Manager können Nutzer als "kritisch" markieren (flaggen)
- Eine Begründung muss angegeben werden (z.B. "Betrugsverdacht", "Mehrfache Beschwerden")
- Markierte Nutzer werden visuell hervorgehoben und können gefiltert werden
- Das System unterstützt manuelle Markierungen und gibt Empfehlungen bei kritischem Trust Score

#### b) Flagging-Historie
- Jede Markierungs- und Entmarkierungsaktion wird in einer Audit-Tabelle gespeichert
- Community Manager können den vollständigen Verlauf einsehen (wer, wann, warum)
- Die Historie bietet Transparenz und dient als Grundlage für Eskalationen
- Markierungshistorie ist nur für CM und Admin-Rollen sichtbar

### 3. Eskalationsprozess

- System markiert gemeldete Inhalte zur Prüfung durch CM/Admin
- Wiederholte Meldungen erhöhen Eskalationsstufe automatisch
- Kritische Vorfälle (z. B. Betrug, Gewaltandrohung) werden sofort an das Supportteam geleitet

### 4. Verwarnungen und Sperrungen

- Verwarnsystem (3-Strikes-Policy)
- Temporäre Sperren bei Verstoß gegen Community-Richtlinien
- Permanente Sperrung bei grobem oder wiederholtem Fehlverhalten

### 5. Konfliktlösung

- CMs moderieren Streitfälle lokal
- Eskalierte Konflikte werden von zentralem Supportteam geprüft
- Ergebnisse dokumentiert im Moderationslog

---

## Automatisierte Prüfungen (Post-MVP)

- Keyword-Erkennung in Nachrichten
- Analyse von Reaktionszeiten und Auffälligkeiten
- Bewertung von Nutzerfeedback (z. B. wiederholt 1-Sterne-Bewertungen)

---

## Moderationslog (Audit Trail)

### System-weites Logging
- Jede Moderationsaktion wird im Backend protokolliert
- Zugriff nur durch berechtigte Rollen
- Einträge enthalten: Timestamp, CM/Admin, Aktion, Nutzer-ID, optional Kommentar

### Spezifische Audit-Tabellen
- **user_flag_audit**: Speziell für Nutzer-Flagging Aktionen
- Speichert Details zu jeder Markierung/Entmarkierung
- Enthält Informationen über ausführenden CM/Admin, Grund, Zeitpunkt
- Dient der Nachvollziehbarkeit und zukünftiger Eskalation

---

## Datenschutz & Fairness

- Nutzer werden über Maßnahmen informiert
- Widerspruchsrecht bei Sperrung oder Bewertung
- DSGVO-konforme Speicherung und Löschfristen

---

## Datenmodell

### user_flag_audit
| Feld       | Typ           | Beschreibung                                  |
|------------|---------------|----------------------------------------------|
| id         | UUID          | Primärschlüssel                              |
| user_id    | UUID          | Referenz zum markierten Nutzer               |
| flagged    | BOOLEAN       | TRUE für Markierung, FALSE für Entmarkierung |
| reason     | TEXT          | Begründung der Markierung (nur bei flagged=TRUE) |
| actor_id   | UUID          | ID des ausführenden CM/Admin                 |
| role       | TEXT          | Rolle des ausführenden CM/Admin              |
| created_at | TIMESTAMP     | Zeitpunkt der Aktion                         |

---

## FAQ für Moderatoren

**Was passiert bei unbegründeten Meldungen?**  
→ Diese werden ignoriert, wiederholte falsche Meldungen können selbst zu einer Verwarnung führen.

**Darf ein CM selbst Aufträge annehmen?**  
→ Ja, aber nur außerhalb des eigenen Zuständigkeitsgebiets (Transparenzpflicht)

**Wer entscheidet über eine permanente Sperrung?**  
→ Nur das zentrale Supportteam in Rücksprache mit der Geschäftsführung

**Wie wird zwischen user_flag_audit und system_logs unterschieden?**  
→ user_flag_audit enthält nur Flagging-spezifische Aktionen und dient der direkten Darstellung im UI.
→ system_logs enthält allgemeine Systemereignisse und dient primär der Fehleranalyse und Administration.

**Was ist, wenn ein Trust Score kritisch ist, aber kein Flagging besteht?**  
→ Das System zeigt Empfehlungen für Nutzer mit kritischem Trust Score an, aber die endgültige Entscheidung zum Flagging liegt beim CM.


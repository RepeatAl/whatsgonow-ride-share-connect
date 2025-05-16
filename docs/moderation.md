
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

### 3. Eskalationssystem

#### a) Eskalationskriterien
- Trust-Score ≤ 30 → automatische Vorwarnung aktivieren
- ≥ 3 Flags innerhalb von 30 Tagen → automatische Vorwarnung
- ≥ 2 Disputes mit negativem Urteil in 60 Tagen → automatische Vorwarnung
- Schwellenwerte sind konfigurierbar in der `moderation_thresholds`-Tabelle

#### b) Eskalationsprozess
- Eskalationen werden in der `escalation_log`-Tabelle dokumentiert
- CM kann einen Nutzer in den Pre-Suspend-Status versetzen
- Ein Admin entscheidet endgültig über Sperrung oder Auflösung der Eskalation
- Jede Eskalation muss dokumentiert und begründet werden

#### c) Pre-Suspend-Status
- Zwischenstufe vor einer permanenten Sperrung
- Zeigt dem Community-Manager und Admin, dass ein Fall schwerwiegend ist
- Kann jederzeit von einem Admin aufgehoben werden

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
- **escalation_log**: Speziell für Eskalationsaktionen und deren Lebenszyklus
- Speichert Details zu jeder Markierung/Entmarkierung/Eskalation
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

### escalation_log
| Feld           | Typ           | Beschreibung                                  |
|----------------|---------------|----------------------------------------------|
| id             | UUID          | Primärschlüssel                              |
| user_id        | UUID          | Referenz zum eskalierten Nutzer              |
| escalation_type| TEXT          | Typ der Eskalation (trust_drop, auto_flag_threshold, etc.) |
| trigger_reason | TEXT          | Detaillierte Begründung der Eskalation       |
| triggered_at   | TIMESTAMP     | Zeitpunkt der Eskalationserstellung          |
| resolved_at    | TIMESTAMP     | Zeitpunkt der Auflösung (nullable)           |
| resolved_by    | UUID          | Admin, der die Eskalation aufgelöst hat      |
| notes          | TEXT          | Zusätzliche Kontext- oder Auflösungsnotizen  |
| metadata       | JSONB         | Zusätzliche strukturierte Informationen      |

### moderation_thresholds
| Feld           | Typ           | Beschreibung                                  |
|----------------|---------------|----------------------------------------------|
| key            | TEXT          | Primärschlüssel, Schwellenwert-Identifier     |
| value          | INTEGER       | Numerischer Schwellenwert                     |
| description    | TEXT          | Beschreibung des Schwellenwerts               |
| updated_at     | TIMESTAMP     | Zuletzt geändert am                           |
| updated_by     | UUID          | Geändert von (Admin-ID)                       |

### profiles (Eskalationserweiterung)
| Feld              | Typ           | Beschreibung                                  |
|-------------------|---------------|----------------------------------------------|
| is_pre_suspended  | BOOLEAN       | Ob der Nutzer im Pre-Suspend-Status ist      |
| pre_suspend_reason| TEXT          | Grund für den Pre-Suspend-Status             |
| pre_suspend_at    | TIMESTAMP     | Zeitpunkt der Pre-Suspension                 |

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

**In welchen Fällen sollte eine Eskalation verwendet werden statt nur eines Flaggings?**  
→ Eskalation sollte bei wiederholten Problemen oder kritischen Einzelfällen verwendet werden, wo eine mögliche Kontosperrung in Betracht gezogen werden muss. Flagging ist für allgemeine Markierung und Überwachung gedacht.

**Kann ein CM einen bereits eskalierten Nutzer wieder "enteskalieren"?**  
→ Nein, nur Admins können Eskalationen auflösen. CMs können jedoch zusätzliche Notizen und Informationen hinzufügen.

**Was ist der "Pre-Suspend"-Status genau?**  
→ Es ist eine Vorstufe zur Sperrung, die anzeigt, dass ein Nutzer unter besonderer Beobachtung steht und seine Fälle priorisiert geprüft werden sollten. Die Funktionalität ist noch nicht eingeschränkt.

**Werden automatische Eskalationen dem Nutzer mitgeteilt?**  
→ Nein, die Eskalation ist ein internes Werkzeug für CMs und Admins. Nutzer werden erst bei konkreten Maßnahmen informiert.

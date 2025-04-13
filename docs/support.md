# Supportprozesse bei Whatsgonow

Diese Datei dokumentiert die Abläufe und Rollen im Supportsystem der Whatsgonow-Plattform.

## 1. Ziel des Supports

Der Support dient dazu, Probleme der Nutzer schnell und effizient zu lösen. Dazu zählen u. a.:

- Lieferverzögerungen
- Streitfälle zwischen Fahrern und Auftraggebern
- Technische Probleme (z. B. App-Fehler)
- Zahlungs- oder Rückerstattungsanfragen

---

## 2. Rollen im Supportprozess

| Rolle             | Berechtigung                                                                 |
|------------------|-------------------------------------------------------------------------------|
| Auftraggeber     | Kann Supportfälle eröffnen und den Verlauf einsehen                          |
| Fahrer           | Kann auf Supportfälle reagieren (z. B. zur Klärung beitragen)                 |
| Community Manager| Kann Supportfälle ihrer Region einsehen, kommentieren und Eskalationen melden|
| Admin            | Hat vollständige Einsicht, Eskalationsrechte und Moderationsfunktionen       |

---

## 3. Supportfall-Workflow

1. **Eröffnung durch Nutzer**
   - Via Button „Problem melden“ auf Auftragsdetailseite
   - Auswahl aus vordefinierten Problemtypen
   - Freitextfeld zur Beschreibung

2. **Fallanlage in der Datenbank**
   - Speicherung unter `/support/cases`
   - Status: `offen`

3. **Benachrichtigung**
   - Der zuständige Community Manager wird benachrichtigt
   - Fall erscheint im Admin-Dashboard

4. **Bearbeitung**
   - Beteiligte Parteien können Kommentare hinzufügen
   - Der Status kann auf `in_bearbeitung`, `gelöst`, `eskaliert` gesetzt werden

5. **Abschluss**
   - Nach Lösungsbestätigung durch Auftraggeber
   - Fall wird archiviert

---

## 4. API-Endpunkte (Auszug)

- `POST /api/support/case` – Supportfall erstellen
- `GET /api/support/cases/:userId` – Fälle eines Nutzers anzeigen
- `PATCH /api/support/case/:caseId/status` – Status aktualisieren
- `POST /api/support/case/:caseId/comment` – Kommentar hinzufügen

---

## 5. Eskalation & Moderation

Community Manager können Fälle eskalieren, wenn:
- keine Reaktion erfolgt
- ein Regelverstoß vorliegt
- ein Fall mehrfach gemeldet wird

Admins können:
- Nutzer temporär oder dauerhaft sperren
- Kommentare moderieren
- Rückerstattungen freigeben (manuell oder automatisiert)

---

## 6. DSGVO & Dokumentation

Alle Supportfälle werden 180 Tage nach Schließung automatisch gelöscht (außer bei aktiven Eskalationen).

Nutzer können jederzeit eine Übersicht ihrer gemeldeten Fälle exportieren (`GET /api/support/export/:userId`).

---

Stand: April 2025

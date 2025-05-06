
# Pre-Registration Formular

Die Voranmeldung (Pre-Registration) wurde als modulares Formular implementiert, um Interessenten die Möglichkeit zu geben, sich für die Plattform zu registrieren.

## Architektur

### Komponenten
Das Formular wurde in folgende Komponenten aufgeteilt:

1. `PreRegistrationForm`: Container-Komponente, die das Formular orchestriert
   - Verwaltet den Formular-Zustand mit React Hook Form
   - Zeigt bedingte UI-Elemente basierend auf Nutzerauswahl
   
2. `PersonalInfoFields`: Komponente für persönliche Informationen
   - Vorname, Nachname
   - E-Mail
   - Postleitzahl
   
3. `RoleSelectionFields`: Komponente für Rollenauswahl
   - Fahrer (wants_driver)
   - Community Manager (wants_cm)
   - Sender (wants_sender)
   
4. `VehicleTypeSelector`: Komponente für Fahrzeugauswahl
   - Wird nur angezeigt, wenn "wants_driver" ausgewählt ist
   - Zeigt verschiedene Fahrzeugtyp-Optionen
   
5. `GdprConsentField`: Komponente für DSGVO-Einwilligung
   - Checkbox mit erforderlicher Zustimmung

### Hooks
- `usePreRegistrationSubmit`: Custom Hook für die Formularverarbeitung
  - Handhabt API-Calls und Fehlerbehandlung
  - Zeigt Toast-Benachrichtigungen
  - Navigationsfunktion für Weiterleitung zur Erfolgsseite

## Validierung
- Schema-basierte Validierung mit Zod
- Mehrsprachige Fehlermeldungen
- Bedingte Validierung für Fahrzeugtyp basierend auf Rollenauswahl

## Workflow
1. Nutzer füllt Formular aus
2. Validierung bei Änderungen und vor Absenden
3. Beim erfolgreichen Absenden: API-Aufruf und Weiterleitung zur Erfolgsseite
4. Bei Fehlern: Anzeige von Benachrichtigungen und Feldfehlern

## Implementierungsdetails
- Verwendung von `react-hook-form` für Formularstatus
- Integration mit i18next für Mehrsprachigkeit
- Verwendung von Shadcn UI Komponenten für konsistentes Design

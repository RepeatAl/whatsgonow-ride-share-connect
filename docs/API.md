# Whatsgonow API Specification

Diese Datei enthält neue Endpunkte, die im Rahmen des MVP und der Post-MVP-Roadmap implementiert wurden.  
Jede API-Sektion enthält eine kurze Beschreibung, Beispiel-Requests und Response-Schemata.

## Neue API-Endpunkte

- `GET /api/admin/dashboard`  
  Übersicht für Admins mit KPIs, Nutzerzahlen und Regionendaten

- `POST /api/support/case`  
  Nutzer meldet ein Problem oder startet eine Eskalation

- `GET /api/support/cases/:userId`  
  Community Manager oder Admin ruft Supportfälle eines Nutzers ab

- `PATCH /api/order/:orderId/return`  
  Retourenprozess anstoßen (Testlauf)

- `GET /api/matching/geo`  
  Routenbasierte Filterung nach Live-Position und Radius

*(Weitere Beispiele und JSON-Schemata folgen in den nächsten Commits.)*

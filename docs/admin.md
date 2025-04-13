# Admin Guide – Whatsgonow Plattform

Dieses Dokument richtet sich an Administratoren der Whatsgonow-Plattform. Es beschreibt die verfügbaren Admin-Funktionen zur Verwaltung von Nutzern, Inhalten und Systemparametern.

---

## Inhaltsverzeichnis

1. [Zugriff](#zugriff)
2. [Nutzerverwaltung](#nutzerverwaltung)
3. [Supportfälle und Eskalationen](#supportfälle-und-eskalationen)
4. [Systemmetriken & Dashboard](#systemmetriken--dashboard)
5. [Moderation & Content-Management](#moderation--content-management)
6. [KYC und Verifizierung](#kyc-und-verifizierung)
7. [Regionale Kontrolle & Community Manager](#regionale-kontrolle--community-manager)

---

## Zugriff

- Nur verifizierte Admins erhalten Zugriff auf das Admin-Panel.
- Authentifizierung erfolgt über Supabase Auth + Rollenprüfung.
- 2FA ist empfohlen.

---

## Nutzerverwaltung

Admins können:

- Nutzerkonten suchen, filtern, sperren oder löschen
- Rollen (z. B. Auftraggeber, Fahrer, CM) anpassen
- KYC-Status einsehen und freigeben
- Bewertungen oder gemeldete Inhalte moderieren

---

## Supportfälle und Eskalationen

- Einsehen und Bearbeiten aller Supportfälle
- Eskalationen an andere Admins oder juristische Einheiten weiterleiten
- Kommunikation mit Nutzern über internes Kommentarsystem möglich

---

## Systemmetriken & Dashboard

Verfügbare KPIs im Admin Dashboard:

- Gesamtanzahl Nutzer, Aufträge, Angebote
- Regionale Verteilung von Aktivitäten
- Umsatz- und Provisionsstatistik
- Durchschnittliche Bewertungswerte
- Performance-Indikatoren (z. B. Ladezeit, Fehlerquote)

---

## Moderation & Content-Management

- Anzeigen von gemeldeten Profilen, Aufträgen und Kommentaren
- Möglichkeit zur temporären oder permanenten Sperrung
- Prüfung auf Verstoß gegen AGB oder Richtlinien

---

## KYC und Verifizierung

Admins können:

- KYC-Status manuell prüfen
- Dokumente einsehen und archivieren
- Verifizierung bei Missbrauch zurücksetzen

---

## Regionale Kontrolle & Community Manager

- Einsehen und Zuordnung von Community Managern zu Regionen
- Anpassung der Provisionssätze pro Region
- Eskalationen von CMs an Admins sichtbar machen

---

**Hinweis:**  
Alle Admin-Aktivitäten werden revisionssicher protokolliert (Audit Log).

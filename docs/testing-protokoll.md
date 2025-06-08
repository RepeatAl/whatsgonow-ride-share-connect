
# What's GoNow – Testing-Protokoll & Reparaturplan

## 🧪 Testdurchlauf 01 – Ergebnisse

### 🔐 Registrierung & Authentifizierung
- ✅ **Pre-Registration funktioniert** (Success-Seite wird erreicht)
- ❌ **Keine Bestätigungs-E-Mail erhalten**
  - Ursache: Fehler in Edge Function (`resend API Key`)
- ❌ **Community Manager Option fehlt**
  - Hinweis: `wants_cm` ist vorhanden in `RoleSelectionFields.tsx`, aber UI zeigt Option nicht an
- ❌ **Kein Redirect nach erfolgreicher Registrierung**
  - User bleibt auf Registrierungsformular hängen
- ✅ **Nach späterer E-Mail-Bestätigung Zugriff auf Dashboard möglich**
- ❌ **Zurück zur Startseite führt auf Landing Page ohne DSGVO-Banner**
- ❌ **Spracheinstellung reagiert nur auf Landing Page**, nicht auf Folgepages

---

## 🧭 Dashboard-Analyse

### 🚨 Doppelte Dashboards im Nutzerbereich
- `/de/dashboard` → Generisches Dashboard (`DashboardWelcome.tsx`)
- `/de/dashboard/driver` → Fahrer-Dashboard (`DashboardDriverPage.tsx`)
- ⚠️ Beide Dashboards sind unabhängig, aber verknüpft über Buttons & Routing
- ➕ "Mein Profil" und "Kartenansicht" leiten fälschlich auf Fahrer-Dashboard

---

## 📊 Fehlende Daten & Funktionen

- ❌ **"Meine Fahrten"** zeigt keine Inhalte
  - `MyRides`-Komponente vorhanden, aber keine Datenanbindung

---

## 🛠 Reparatur- und Entwicklungsplan

### **Phase 1: Registrierung & E-Mail-Fixes**
- [ ] Edge Function `pre-register` reparieren (Resend API Key)
- [ ] Bestätigungsmail-Versand sicherstellen
- [ ] `RegisterForm.tsx` um Community Manager Rolle ergänzen
- [ ] Redirect nach erfolgreicher Registrierung einbauen

---

### **Phase 2: Dashboard-Konsolidierung (KRITISCH)**
- [ ] Inhalte von `/dashboard/driver` in `/dashboard` integrieren
- [ ] `DashboardWelcome.tsx` rollenspezifisch erweitern (Widgets, KPIs)
- [ ] `/dashboard/driver` entfernen oder Redirect zu `/dashboard`
- [ ] Rollenbasierte Anzeige:
  - Fahrer: Aktive Fahrten, Verdienste, Kartenansicht
  - Sender: Aufträge, Statusverfolgung
  - Community Manager/Admin: Systemmetriken, Supportdaten
- [ ] Einheitliches, responsives Layout mit einheitlichem Stil

---

### **Phase 3: Funktionalität & Tests**
- [ ] `MyRides.tsx` mit echten Nutzerdaten verbinden
- [ ] "Meine Fahrten"-Liste korrekt anzeigen
- [ ] Testfälle dokumentieren und regelmäßig aktualisieren

---

### **Phase 4: DSGVO & Sprachlogik**
- [ ] DSGVO-Banner korrekt einbinden (auch nach Redirects sichtbar)
- [ ] Consent-Einstellungen speichern & anwenden
- [ ] Sprachumschalter global funktionsfähig machen (nicht nur Landing Page)

---

## 📁 Hinweise für Developer

### Temporäre Maßnahmen
- [ ] Authentifizierungs-Code (Login/Auth Flow) **sperren** bis Phase 1 abgeschlossen
- [ ] Zugriff auf `/dashboard/driver` temporär blockieren oder redirecten

---

## 📂 Weiteres Vorgehen

- Diese Datei wird fortlaufend aktualisiert.
- Integration in Git-Repository empfohlen.
- Nach jeder Phase: Testprotokolle ergänzen & Regressionstests durchführen.

---

## 🔄 Testdurchlauf 02 – [Datum einfügen]

### Geplante Tests:
- [ ] Pre-Registration E-Mail-Versand
- [ ] Community Manager Option sichtbar
- [ ] Redirect nach Registrierung
- [ ] Dashboard-Konsolidierung
- [ ] "Meine Fahrten" funktional
- [ ] DSGVO-Banner auf allen Seiten

### Ergebnisse:
[Wird nach Tests aktualisiert]

---

*Letzte Aktualisierung: $(date) - Testdurchlauf 01 dokumentiert*

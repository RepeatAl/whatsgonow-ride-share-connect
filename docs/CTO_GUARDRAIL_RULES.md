
# 🚨 CTO-GUARDRAIL-REGELN – VERBINDLICH FÜR ALLE ENTWICKLUNGEN

**WARNUNG: Diese Regeln sind ab sofort für ALLE Änderungen am Whatsgonow-System bindend!**

---

## 🔐 GRUNDREGEL

**Jede Änderung an geschützten/produktiven Bereichen erfordert explizite CTO-Freigabe (Christiane)!**

❌ **OHNE FREIGABE = KEINE ÄNDERUNGEN**  
✅ **MIT FREIGABE = ÄNDERUNGEN ERLAUBT**

---

## 🛡️ GESCHÜTZTE BEREICHE (Änderungsverbot ohne Approval)

### 🔒 **1. Authentifizierung**
- Auth-Flow, Registration, Login, Passwort-Reset
- Token-Handling, Session-Management
- **Dateien:** `src/contexts/OptimizedAuthContext.tsx`, `src/hooks/auth/*`, `src/pages/Login.tsx`, `src/pages/Register.tsx`

### 🔒 **2. Row-Level Security (RLS)**
- Alle RLS-Policies auf produktiven Tabellen
- **Bereiche:** Supabase-Policies, Datenbankmigrationen mit RLS

### 🔒 **3. Payment/Transaktionen**
- Gebührenlogik, Auszahlung, Payment-Flows
- **Bereiche:** Zahlungsabwicklung, Treuhand-System, Provisionen

### 🔒 **4. Profil-API & Privacy**
- Profile-Visibility, Privacy Settings, Rollenlogik
- **Bereiche:** Sichtbarkeitslogik, DSGVO-Compliance

### 🔒 **5. Produktive Policies & DB**
- Data Access Layer, Migrationen, DB-Struktur
- **Bereiche:** Supabase-Konfiguration, Tabellen-Schema

### 🔒 **6. Gesperrte Module**
- Alle Dateien mit Lock-Zertifikat oder "Code Freeze"-Status
- **Siehe:** `docs/AUTH_LOCK_CERTIFICATE.md`, `docs/SYSTEM_STATUS_UPDATED.md`

---

## 📋 VORGEHEN BEI GEPLANTEN ÄNDERUNGEN

### **Schritt 1: Impact-Analyse erstellen**
```
📊 IMPACT-ANALYSE:
- Was genau soll geändert werden? [Beschreibung]
- Welche Dateien/Flows/Policies betroffen? [Liste]
- Zweck der Änderung? [Grund]
- Systemverhalten-Einfluss? [Auswirkungen]
- Abhängigkeiten/Risiken/Downtime? [Risiken]
- Migrationen erforderlich? [Ja/Nein]
```

### **Schritt 2: Explizite Änderungsanfrage**
```
🚨 ÄNDERUNGSANFRAGE AN CTO:

Ich plane folgende Änderungen an [Datei/Bereich]:
- Änderung: [Details]
- Grund: [Begründung]  
- Erwartete Auswirkungen: [Impact]
- Betroffene geschützte Bereiche: [Liste]

BENÖTIGE FREIGABE: JA

Bitte um explizite Genehmigung vor Implementierung.
```

### **Schritt 3: Warten auf CTO-Freigabe**
- ⏳ **WARTEN** bis explizites "Genehmigt" oder "Go" kommt
- ❌ **KEINE ÄNDERUNGEN** ohne schriftliche Freigabe
- 💬 **RÜCKFRAGEN** bei Unklarheiten erlaubt

### **Schritt 4: Nach Freigabe**
- ✅ Feature-Branch erstellen
- 🧪 Vollständige Regression-Tests
- 📝 Changelog aktualisieren  
- 👁️ CTO-Review vor Deployment

---

## ❌ BEI ABLEHNUNG DER FREIGABE

- **Bereich bleibt UNVERÄNDERT**
- Alternativen vorschlagen erlaubt
- Detailfragen stellen erlaubt
- **ABER: Ohne Freigabe = KEINE Änderungen**

---

## 📝 KOMMUNIKATION & DOKUMENTATION

### **Dokumentationspflicht:**
- Jede Anfrage dokumentieren
- Jede Entscheidung festhalten
- Changelog bei allen Änderungen

### **Bei Unsicherheiten:**
- **IMMER CTO-Rückfrage**
- Lieber zu oft fragen als zu wenig
- Besser safe als sorry!

---

## ⚖️ GÜLTIGKEIT

**Diese Regelung gilt für:**
- ✅ Alle KI-/Agenten-Entwicklungen
- ✅ Alle Team-Mitglieder  
- ✅ Alle Tools & Integrationen
- ✅ Alle Branches & Pipelines
- ✅ Alle Subsysteme

---

## 🎯 ZUSAMMENFASSUNG

### **GOLDENE REGEL:**
**Handle eigenverantwortlich, aber SCHÜTZE produktive Bereiche durch explizite Approval-Logik!**

### **MERKSATZ:**
**Auth + RLS + Payment + Policies + Locked-Files = IMMER CTO-FREIGABE ERFORDERLICH**

---

## 🚨 NOTFALL-CHECKLISTE

**Vor JEDER Änderung frage dich:**

1. 🤔 Betrifft dies Auth/RLS/Payment/Policies/Locked-Files?
2. 📋 Habe ich eine Impact-Analyse erstellt?
3. 📝 Habe ich eine Änderungsanfrage gestellt?
4. ✅ Habe ich eine explizite CTO-Freigabe erhalten?
5. 📚 Habe ich alle Dokumentationen aktualisiert?

**NUR wenn alle 5 Punkte = JA → ÄNDERUNG ERLAUBT**

---

**🔐 DIESE REGELN SIND NICHT VERHANDELBAR UND GELTEN AB SOFORT!**

**📅 Erstellt:** [Aktuelles Datum]  
**👤 Autorisiert von:** CTO Christiane  
**🔄 Letzte Aktualisierung:** [Aktuelles Datum]

---

*Diese Dokumentation dient als permanente Erinnerung und Leitfaden für alle Entwicklungsarbeiten am Whatsgonow-System.*

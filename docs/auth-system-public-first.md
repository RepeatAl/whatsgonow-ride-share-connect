
# Public-First Auth System - Finales Sichtbarkeits- & Aktionsschema

## 🎯 Systemüberblick

Das Whatsgonow Auth-System folgt dem **"Public-First"** Prinzip: Nutzer können die Plattform vollständig erkunden und vorbereiten, bevor sie sich anmelden müssen. Login wird nur bei konkreten Aktionen erforderlich, die rechtlich, datenschutzrechtlich oder vertraglich relevant sind.

### Kernprinzipien
- **"Try before you register"** - Nutzer können alles ausprobieren
- **Nahtloser Login-Flow** - Kein Redirect, sondern Modal-basiert
- **Granulare Berechtigungen** - Jede Aktion einzeln geschützt
- **DSGVO-konform** - Personenbezogene Daten nur nach Login
- **Performance-optimiert** - Keine unnötigen Auth-Checks

## 🔓 Öffentlich zugänglich (ohne Login)

### Fahrtsuche & Transport
| Feature | Beschreibung | Technische Umsetzung |
|---------|-------------|---------------------|
| **Fahrtsuche** | Suche von A nach B, Zeit, Datum, Fahrzeugtyp | Vollständig öffentlich, keine Auth-Checks |
| **Fahrervorschau** | Name, Profilbild, Fahrzeugdaten, Bewertungen | Public-Queries ohne RLS-Einschränkung |
| **Karte & Regionen** | Öffentliche Fahrten ohne Privatdaten | Anonymisierte Geodaten, keine Adressen |

### Artikel & Vorbereitung
| Feature | Beschreibung | Technische Umsetzung |
|---------|-------------|---------------------|
| **Artikel vorbereiten** | Bilder hochladen, KI-Analyse, Kategorisierung | Temporärer Gast-Bucket, Migration nach Login |
| **KI-Vorschläge** | Automatische Kategorisierung, Preisschätzung | Serverless Functions ohne User-Context |

### Community & Information
| Feature | Beschreibung | Technische Umsetzung |
|---------|-------------|---------------------|
| **Öffentlicher Chat** | Community-FAQ, Gruppendiskussionen | Read-only ohne Interaktion |
| **Info/Hilfe/FAQ** | Konzept, Preise, Sprache, Impressum | Statische Inhalte, i18n-unterstützt |

## 🔐 Geschützt (Login zwingend erforderlich)

### Transaktionale Aktionen
| Aktion | Begründung | AuthRequired Action |
|--------|-----------|-------------------|
| **Transport buchen** | Vertragsrelevant, Account-Zuordnung | `book_transport` |
| **Artikel veröffentlichen** | Authentifizierung erforderlich | `publish_item` |
| **Deal starten** | Vertragsrelevant | `submit_offer` |
| **Auftrag annehmen** | Vertragsbindung | `accept_order` |

### Kommunikation & Kontakt
| Aktion | Begründung | AuthRequired Action |
|--------|-----------|-------------------|
| **Fahrer kontaktieren** | Personenbezogene Kommunikation | `contact_driver` |
| **Private Nachricht** | DSGVO-Schutz | `send_private_message` |
| **Dispute eröffnen** | Verantwortung & Nachvollziehbarkeit | `open_dispute` |

### Persönliche Daten
| Aktion | Begründung | AuthRequired Action |
|--------|-----------|-------------------|
| **Adresse eingeben** | Schutz privater Daten | `enter_address` |
| **Profil ändern** | Nutzerdaten-Zugriff | `edit_profile` |
| **Zahlungsdaten** | Sensible Finanzdaten | `manage_payment` |

## 🧰 Technische Implementierung

### AuthRequired Wrapper
Zentrale Komponente für alle geschützten Aktionen:

```tsx
<AuthRequired 
  action="publish_item" 
  loginPrompt="Zum Speichern bitte anmelden"
  onAuthSuccess={() => handlePublish()}
>
  <Button>Artikel veröffentlichen</Button>
</AuthRequired>
```

### Permission Matrix
Zentrale Konfiguration in `src/auth/permissions.ts`:

```typescript
export const loginRequiredActions = {
  // Transaktional
  publish_item: true,
  book_transport: true,
  submit_offer: true,
  accept_order: true,
  
  // Kommunikation
  contact_driver: true,
  send_private_message: true,
  open_dispute: true,
  
  // Persönliche Daten
  enter_address: true,
  edit_profile: true,
  manage_payment: true
};
```

### Login-Flow
1. **Trigger**: Nutzer klickt geschützten Button
2. **Check**: `requiresAuthentication(action)` prüft Permission
3. **Modal**: LoginPrompt öffnet sich nahtlos
4. **Redirect**: Nach Login automatisch zurück zur Aktion
5. **Ausführung**: Ursprüngliche Aktion wird ausgeführt

## 🧪 Testbare User Journey

### Öffentliche Nutzung (ohne Login)
```
✅ Fahrtsuche A → B + Details ansehen
✅ Fahrzeugfotos ansehen  
✅ Artikelbilder hochladen & KI-Vorschlag
✅ Chat-Historie lesen
✅ Sprache wechseln
✅ FAQ durchsuchen
```

### Geschützte Aktionen (Login erforderlich)
```
🔐 Artikel speichern/veröffentlichen
🔐 Fahrer kontaktieren
🔐 Deal annehmen/stornieren  
🔐 Chat schreiben/Angebot machen
🔐 Transportanfrage erstellen
🔐 Profil bearbeiten
```

## 📦 Migrations-Status

### ✅ Phase 1: FindTransport (Abgeschlossen)
- Öffentliche Fahrersuche implementiert
- `AuthRequired` für "Transportanfrage erstellen"
- `AuthRequired` für "Fahrer kontaktieren"
- i18n-Unterstützung für Transport-Übersetzungen

### 🟡 Phase 2: ItemUpload (In Vorbereitung)
- Öffentlicher Bild-Upload (temporär)
- `AuthRequired` für "Artikel speichern"
- Migration temp → user-bucket nach Login
- KI-Analyse ohne Login

### ⏳ Phase 3: ChatInterface (Geplant)
- Trennung Public-Chat vs. Private-Interaction
- `AuthRequired` für MessageInput
- `AuthRequired` für Preisangebote
- WebSocket nur nach Login

## 🔧 Entwickler-Guidelines

### Do's
- ✅ Immer `AuthRequired` für geschützte Aktionen
- ✅ Permission-Matrix vor neuen Aktionen erweitern
- ✅ i18n für alle Login-Prompts
- ✅ Öffentliche Komponenten ohne `useAuth()`
- ✅ Modal-basierte Login-Flows

### Don'ts
- ❌ Keine direkten Auth-Checks in UI-Komponenten
- ❌ Keine Redirect-basierten Login-Flows
- ❌ Keine `ProtectedRoute` außer für Dashboard/Admin
- ❌ Keine RLS-Änderungen für Public-First
- ❌ Keine Auth-Context in Business-Logic

## 🌍 Internationalisierung

Login-Prompts unterstützen vollständige i18n:

```json
// auth.json
{
  "login_required_for_publish": "Zum Veröffentlichen bitte anmelden",
  "login_required_for_contact": "Zum Kontaktieren bitte anmelden",
  "login_required_for_booking": "Zum Buchen bitte anmelden"
}
```

## 🔒 Sicherheit & DSGVO

- **RLS-Policies**: Bleiben unverändert in Supabase
- **Temporäre Daten**: Automatische Bereinigung nach 24h
- **Personenbezogene Daten**: Nur nach explizitem Login
- **Audit-Log**: Alle geschützten Aktionen protokolliert
- **Session-Management**: Sichere Token-Verwaltung

## 🚀 Performance

- **Reduzierte Auth-Checks**: Nur bei konkreten Aktionen
- **Lazy Loading**: User-Context nur bei Bedarf
- **Caching**: Öffentliche Daten gecacht
- **WebSocket**: Erst nach Login aktiviert
- **Optimistic UI**: Sofortige Feedback bei Aktionen

## 📊 Monitoring & Analytics

### Key Metrics
- **Public-to-Auth Conversion**: Wie viele Gäste registrieren sich?
- **Action-Trigger Rate**: Welche Aktionen triggern Login am häufigsten?
- **Drop-off Rate**: Wo brechen Nutzer den Login-Prozess ab?
- **Session Length**: Wie lange bleiben Nutzer nach Login aktiv?

### Tracking-Events
```typescript
// Beispiel-Events für Analytics
track('public_browse', { feature: 'transport_search' });
track('auth_required_triggered', { action: 'contact_driver' });
track('login_completed', { trigger_action: 'publish_item' });
track('auth_success_action', { completed_action: 'submit_offer' });
```

---

**Status**: Produktionsreif seit Phase 1  
**Letzte Aktualisierung**: 2025-01-07  
**Nächste Review**: Nach Phase 3 Abschluss

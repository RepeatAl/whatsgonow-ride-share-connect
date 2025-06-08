
# Public-First Auth System - Whatsgonow Zugriffskonzept & Datenschutz

## 🎯 Grundprinzip: Public First

Das Whatsgonow Auth-System folgt dem **"Public First"** Prinzip: Alle öffentlichen Inhalte und Funktionen bleiben auch im eingeloggten Zustand uneingeschränkt sichtbar. Es gibt keine restriktiven Barrieren für eingeloggte Nutzer in Bezug auf allgemein zugängliche Informationen.

### Philosophie & Leitlinien
- **Public First**: Alle Inhalte, die keinen Personenbezug haben, sind ohne Login zugänglich
- **Public bleibt Public**: Öffentliche Inhalte bleiben im eingeloggten Zustand weiter sichtbar
- **Anonyme Vorregistrierung**: Kein Supabase-Login nötig für Pre-Registration
- **Registrierung = Start geschützter Bereich**: Erst mit Login gelten Datenschutz-Pflichten
- **Deal-orientierte Abschottung**: Erst mit Angebotsannahme gelten Transaktionspflichten

## 🔓 Öffentlich zugänglich (ohne Login)

### Allgemeine Inhalte
| Feature | Beschreibung | Technische Umsetzung |
|---------|-------------|---------------------|
| **Startseite** | Landing Page, Karten, FAQs, Blogartikel | Vollständig öffentlich, keine Auth-Checks |
| **Fahrtsuche** | Suche von A nach B, Zeit, Datum, Fahrzeugtyp | Vollständig öffentlich, keine Auth-Checks |
| **Video-Inhalte** | How-to-Videos, Plattform-Erklärungen | Öffentliche Video-Galerie |

### Fahrt- und Transportinformationen
| Sichtbar für alle | Beschreibung |
|------------------|-------------|
| **Abfahrts- und Zielregion** | Grober geografischer Bereich |
| **Uhrzeit & Datum** | Zeitangaben für Fahrten |
| **Fahrzeugtyp & -größe** | Transportkapazität, Fahrzeugkategorie |
| **Fahrtbeschreibung** | Allgemeine Beschreibung der Route |
| **Trust Score & Ratings** | Bewertungen und Vertrauenswerte |
| **Fahrernamen** | Bei veröffentlichten Fahrten sichtbar |
| **Firmenname (Business)** | Name von sender_business Nutzern |

### Uploads (Vorbereitung ohne Login)
| Feature | Beschreibung | Technische Umsetzung |
|---------|-------------|---------------------|
| **Artikel vorbereiten** | Bilder hochladen, KI-Analyse | Temporärer Gast-Bucket, Migration nach Login |
| **KI-Vorschläge** | Kategorisierung, Preisschätzung | Serverless Functions ohne User-Context |

### Community & Information
| Feature | Beschreibung | Technische Umsetzung |
|---------|-------------|---------------------|
| **Öffentliche Posts** | Community-Beiträge, Kommentare | Read-only ohne Interaktion |
| **FAQ & Support** | Hilfe, Preise, Impressum | Statische Inhalte, i18n-unterstützt |

## 🔐 Geschützt (Login zwingend erforderlich)

### Für alle Nutzer geschützt

#### Persönliche Daten
| Datentyp | Beschreibung | AuthRequired Action |
|----------|-------------|-------------------|
| **E-Mail-Adressen** | Alle E-Mail-Kontakte | `view_contact_data` |
| **Telefonnummern** | Private Telefonnummern | `view_contact_data` |
| **Private Adressen** | Wohn- und Lieferadressen | `view_address` |
| **GPS-Positionen** | Personenbezogene Standortdaten | `view_location_data` |

#### Transaktionale Aktionen
| Aktion | Begründung | AuthRequired Action |
|--------|-----------|-------------------|
| **Uploads speichern/veröffentlichen** | Account-Zuordnung erforderlich | `publish_item` |
| **Transport buchen** | Vertragsrelevant | `book_transport` |
| **Deal starten/annehmen** | Vertragsbindung | `accept_deal` |
| **Fahrer kontaktieren** | Personenbezogene Kommunikation | `contact_driver` |

### Rollenspezifische Sichtbarkeit

#### Private Auftraggeber (sender_private)
| Datentyp | Sichtbarkeit |
|----------|-------------|
| **Name** | Geschützt - nur eigene Sicht |
| **Adresse** | Geschützt - nur bei bestätigtem Deal |
| **Empfängerinformationen** | Immer geschützt |

#### Geschäftliche Auftraggeber (sender_business)  
| Datentyp | Sichtbarkeit |
|----------|-------------|
| **Firmenname** | Öffentlich sichtbar |
| **Abhol-/Lieferadresse** | Öffentlich (nur Ortsbezug, keine Person) |
| **Empfängername** | Geschützt |

#### Fahrer (driver)
| Datentyp | Sichtbarkeit |
|----------|-------------|
| **Fahrername** | Öffentlich bei aktiver Fahrt |
| **Fahrzeugbeschreibung** | Öffentlich |
| **Zustellnachweis** | Nur für Empfänger + Auftraggeber |

## 🔄 User Journey & Auth-Flow

### 1. Anonymer Zugang (Public)
- **Sichtbar**: Home, FAQ, Kartenansicht, Auftragsvorschau, Videos
- **Optional**: Pre-Registration
- **Auch im Login-Modus zugänglich**: Kein Restriktionswechsel durch Login

### 2. Vorregistrierung (Pre-Registration)
- **Edge Function**: `pre-register`
- **Kein Login erforderlich**
- **Felder**: Vorname, Nachname, E-Mail, PLZ, Interessen, DSGVO-Zustimmung
- **Speicherung**: `pre_registrations` Tabelle
- **Email-Bestätigung**: Via Resend API (mehrsprachig)
- **Fehlerfall**: 409 wenn E-Mail bereits existiert

### 3. Registrierung (Register)
- **Supabase Auth aktiviert**
- **Profilanlage**: Durch `handle_new_user` Trigger
- **Zieltabellen**: `auth.users`, `profiles`

### 4. Login (Sign-In)
- **Session-Laden + Profile-Laden**
- **Redirect-Logik**: Rollenbasiert zu Dashboard
- **Incomplete Profiles**: Redirect zu `/complete-profile`

### 5. Dashboard (Geschützter Bereich)
- **Zugriff**: Nur mit vollständigem Profil
- **Sichtbar**: Eigene Aufträge, Angebote, Inbox, Feedback
- **Öffentliche Inhalte**: Bleiben parallel erreichbar

## 🧰 Technische Implementierung

### AuthRequired Wrapper
```tsx
<AuthRequired 
  action="publish_item" 
  loginPrompt="Zum Speichern bitte anmelden"
  onAuthSuccess={() => handlePublish()}
>
  <Button>Artikel veröffentlichen</Button>
</AuthRequired>
```

### RLS-Logik (Role-Based Access Control)
| Tabelle | Rolle | Rechte |
|---------|-------|--------|
| `pre_registrations` | anon | INSERT only |
| `profiles` | authenticated | SELECT/UPDATE (nur eigenes) |
| `orders` | driver/sender | Nur eigene (nach Match) |
| `public_content` | public, all | SELECT |

### Redirect-Logik (useAuthRedirect.ts)
| Zustand | Zielpfad |
|---------|----------|
| Login-Page + eingeloggt | `/dashboard/[role]` |
| Nach Login auf `/` | `/dashboard/[role]` |
| Unvollständiges Profil | `/complete-profile` |
| onboarding_complete false | Onboarding Wizard |
| Abgemeldet + private Route | `/login` |

## 📊 Permission Matrix

### Login-Required Actions
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
  start_chat: true,
  
  // Persönliche Daten
  view_address: true,
  view_contact_data: true,
  edit_profile: true,
  manage_payment: true,
  
  // Uploads
  save_item: true,
  create_transport_request: true
};
```

### Public Actions
```typescript
export const publicActions = [
  'browse_items',
  'search_transport', 
  'view_public_info',
  'change_language',
  'prepare_upload',
  'view_ratings',
  'view_company_info'
];
```

## 🛡️ Datenschutz & DSGVO

### Grundsätze
- **Minimale Datenerhebung**: Nur notwendige Daten ohne Login
- **Klare Trennung**: Personenbezogen vs. allgemeine Inhalte  
- **Transparenz**: Nutzer sehen was öffentlich wird
- **Löschrechte**: Vollständige Datenlöschung möglich

### Technische Umsetzung
- **RLS-Policies**: Bleiben unverändert in Supabase
- **Temporäre Daten**: Automatische Bereinigung nach 24h
- **Audit-Log**: Alle geschützten Aktionen protokolliert
- **Session-Management**: Sichere Token-Verwaltung

## 🔧 Optimierungspotenziale

| Bereich | Verbesserungsvorschlag |
|---------|----------------------|
| **Pre-Registration** | Optionaler Link zu Registrierung bei 409-Fehler |
| **Redirect-Logik** | Erkennung für `/` ergänzen für sofortiges Dashboard |
| **Profilvalidierung** | Onboarding-Fortschritt über `onboarding_complete` |
| **UX** | Hinweise bei bereits existierender Registrierung |
| **Resend Integration** | Logging & Retry-Logik verbessern |

## 🧪 Testbare User Journey

### Öffentliche Nutzung (ohne Login)
```
✅ Fahrtsuche A → B + Details ansehen
✅ Fahrzeugfotos ansehen  
✅ Artikelbilder hochladen & KI-Vorschlag
✅ Video-Galerie durchsuchen
✅ FAQ & Community-Posts lesen
✅ Sprache wechseln
```

### Geschützte Aktionen (Login erforderlich)
```
🔐 Artikel speichern/veröffentlichen
🔐 Fahrer kontaktieren
🔐 Deal annehmen/stornieren  
🔐 Chat schreiben/Angebot machen
🔐 Transportanfrage erstellen
🔐 Profil bearbeiten
🔐 Persönliche Daten einsehen
```

## 📦 Status & Roadmap

### ✅ Phase 1: Transport Search (Abgeschlossen)
- Öffentliche Fahrersuche implementiert
- `AuthRequired` für Transportanfragen
- i18n-Unterstützung

### ✅ Phase 2: Pre-Registration (Abgeschlossen)  
- Anonyme Vorregistrierung
- Resend Email-Integration
- Mehrsprachige Templates

### 🟡 Phase 3: ItemUpload (In Entwicklung)
- Öffentlicher Bild-Upload (temporär)
- `AuthRequired` für "Artikel speichern"
- Migration temp → user-bucket nach Login

### ⏳ Phase 4: Enhanced Chat (Geplant)
- Trennung Public-Chat vs. Private Messages
- `AuthRequired` für Nachrichten
- WebSocket nur nach Login

---

**Status**: Produktionsreif seit Phase 2  
**Letzte Aktualisierung**: 2025-06-08  
**Nächste Review**: Nach Phase 4 Abschluss

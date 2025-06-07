
# Hybrid-Login-System: Öffentlich vs. Geschützt

## 🎯 Konzept

Das neue Auth-System folgt dem Prinzip **"Public First"** - Nutzer können die meisten Features ohne Anmeldung nutzen und werden nur bei personenbezogenen Aktionen zum Login aufgefordert.

## 🔓 Öffentlicher Bereich (Public Mode)

### Ohne Login nutzbar:
- **Website durchsuchen**: Startseite, FAQ, Support
- **Transport suchen**: Alle öffentlichen Angebote filtern und ansehen
- **Artikel browsen**: Verfügbare Items durchsuchen
- **Sprache wechseln**: Internationalisierung
- **Demo-Features**: Map-Demos, ESG-Dashboard
- **Formulare vorbereiten**: Daten eingeben (noch nicht speichern)

### Technische Umsetzung:
```tsx
// Öffentliche Seiten benötigen KEINE Auth-Wrapper
function TransportSearch() {
  return <div>Alle können suchen...</div>;
}
```

## 🔐 Geschlossener Bereich (Login-Required Mode)

### Login erforderlich bei:
- **Daten speichern**: Artikel veröffentlichen, Profil anlegen
- **Deals abschließen**: Transport buchen, Angebot annehmen  
- **Kommunikation**: Chat starten, Nachrichten schreiben
- **Persönliche Daten**: Vollständige Adressen einsehen
- **Transaktionen**: Zahlungen, Verifizierung

### Technische Umsetzung:
```tsx
import AuthRequired from '@/components/auth/AuthRequired';

function CreateOrderForm() {
  return (
    <form>
      {/* Öffentlich: Formular ausfüllen */}
      <input placeholder="Von..." />
      <input placeholder="Nach..." />
      
      {/* Geschützt: Nur bei Speichern/Veröffentlichen */}
      <AuthRequired action="create_order" loginPrompt="Zum Veröffentlichen bitte anmelden">
        <Button type="submit">Auftrag veröffentlichen</Button>
      </AuthRequired>
    </form>
  );
}
```

## 🏗️ Architektur-Übersicht

### Zentrale Komponenten:

1. **AuthRequired** (`/src/components/auth/AuthRequired.tsx`)
   - Prüft bei Button-Klicks ob Login nötig
   - Zeigt Login-Modal wenn erforderlich
   - Führt Aktion nach Login automatisch aus

2. **Permission Matrix** (`/src/auth/permissions.ts`)
   - Definiert welche Aktionen Login brauchen
   - Zentrale Konfiguration für alle Features
   - Erweiterbar für Rollen und Berechtigungen

3. **LoginPrompt** (`/src/components/ui/LoginPrompt.tsx`)
   - Modal für nahtlose Login-Aufforderung
   - Redirect zurück zur ursprünglichen Aktion
   - Registrierung als Alternative

### Routing-System:

- **ProtectedRoute**: Nur für Dashboard, Profile, Messages, Admin
- **PublicRoute**: Vereinfacht, nur Redirect bei Login/Register-Seiten  
- **Alle anderen Routen**: Komplett öffentlich, Auth-Check auf Action-Ebene

## 📝 Verwendung

### 1. Neue geschützte Aktion hinzufügen:

```tsx
// 1. In permissions.ts registrieren
export const loginRequiredActions = {
  my_new_action: {
    action: "my_new_action",
    requiresLogin: true,
    description: "Meine neue geschützte Funktion"
  }
};

// 2. In Komponente verwenden
<AuthRequired action="my_new_action" loginPrompt="Für diese Funktion bitte anmelden">
  <Button onClick={handleMyAction}>Meine Aktion</Button>
</AuthRequired>
```

### 2. Öffentliche Seite erstellen:

```tsx
// Keine Auth-Wrapper nötig, einfach normale Komponente
function PublicPage() {
  return (
    <div>
      <h1>Öffentlich für alle</h1>
      <SearchForm />
      <FilterOptions />
    </div>
  );
}
```

### 3. Nach-Login-Redirect handhaben:

```tsx
// AuthRequired speichert automatisch die ursprüngliche Aktion
<AuthRequired 
  action="book_transport" 
  onAuthSuccess={() => {
    // Wird nach erfolgreichem Login ausgeführt
    handleBooking();
  }}
>
  <Button>Jetzt buchen</Button>
</AuthRequired>
```

## 🚀 Migration bestehender Komponenten

### Vorher (komplex):
```tsx
function OldComponent() {
  const { user } = useOptimizedAuth();
  
  if (!user) {
    return <LoginRedirect />;
  }
  
  return <ProtectedContent />;
}
```

### Nachher (einfach):
```tsx
function NewComponent() {
  return (
    <div>
      {/* Öffentlicher Content */}
      <PublicContent />
      
      {/* Nur Button geschützt */}
      <AuthRequired action="submit_data">
        <Button>Daten speichern</Button>
      </AuthRequired>
    </div>
  );
}
```

## 🌍 i18n Integration

Login-Prompts nutzen automatisch die bestehenden i18n-Übersetzungen:

```json
// auth.json
{
  "login_required": "Anmeldung erforderlich",
  "login_required_message": "Für diese Aktion musst du angemeldet sein.",
  "login_to_continue": "Anmelden um fortzufahren"
}
```

## 🔒 Sicherheit

- **RLS-Policies**: Bleiben vollständig erhalten
- **Supabase Session**: Greift erst nach Login wie gehabt
- **DSGVO-Compliance**: Personenbezogene Daten nur nach Login
- **Role-Based Access**: Erweiterbar über Permission Matrix

## 🧪 Testing

```tsx
// Public Actions testen
it('should allow public browsing without login', () => {
  render(<TransportSearch />);
  expect(screen.getByText('Alle Angebote')).toBeInTheDocument();
});

// Protected Actions testen  
it('should show login prompt for protected action', () => {
  render(
    <AuthRequired action="create_order">
      <Button>Bestellen</Button>
    </AuthRequired>
  );
  
  fireEvent.click(screen.getByText('Bestellen'));
  expect(screen.getByText('Anmeldung erforderlich')).toBeInTheDocument();
});
```

## 📊 Vorteile

- ✅ **UX**: "Try before you register"-Philosophie
- ✅ **Performance**: Weniger Auth-Checks, schnelleres Laden
- ✅ **Wartbarkeit**: Zentrale Permission-Verwaltung
- ✅ **SEO**: Mehr öffentliche Inhalte für Suchmaschinen
- ✅ **Mobile**: Nahtlose Touch-Bedienung ohne Redirects
- ✅ **Skalierbarkeit**: Einfach neue Features hinzufügen

## 🔄 Nächste Schritte

### Pilot-Migrationen geplant:
1. ✅ **CreateOrderForm** - Umgesetzt
2. 🔄 **ItemUploadForm** - In Planung
3. 🔄 **ChatInterface** - In Planung
4. 🔄 **TransportSearch** - In Planung

### Erweiterungen möglich:
- Rollenbasierte Permissions
- Bedingte Aktionen (z.B. nur zu bestimmten Zeiten)
- Audit-Log für geschützte Aktionen
- Rate-Limiting pro Aktion


# Auth-System Implementierungsleitfaden

## 🚀 Quick Start für Entwickler

### Schritt 1: AuthRequired einbinden
```tsx
import AuthRequired from '@/components/auth/AuthRequired';

// In deiner Komponente
<AuthRequired action="publish_item" loginPrompt="Zum Speichern bitte anmelden">
  <Button onClick={handleSave}>Speichern</Button>
</AuthRequired>
```

### Schritt 2: Permission prüfen (optional)
```tsx
import { requiresAuthentication } from '@/auth/permissions';

const needsLogin = requiresAuthentication('contact_driver');
```

### Schritt 3: i18n-Support
```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation(['auth']);

<AuthRequired 
  action="submit_offer" 
  loginPrompt={t('auth:login_required_for_offer')}
>
  <Button>Angebot senden</Button>
</AuthRequired>
```

## 📁 Dateistruktur

```
src/
├── auth/
│   ├── permissions.ts          # Zentrale Permission-Matrix
│   └── README.md              # Auth-System Dokumentation
├── components/
│   ├── auth/
│   │   └── AuthRequired.tsx   # Hauptkomponente
│   ├── ui/
│   │   └── LoginPrompt.tsx    # Login-Modal
│   └── routing/
│       ├── ProtectedRoute.tsx # Für Dashboard/Admin
│       └── PublicRoute.tsx    # Vereinfacht
└── i18n/locales/
    ├── de/auth.json           # Deutsche Übersetzungen
    └── en/auth.json           # Englische Übersetzungen
```

## 🔧 Komponenten-API

### AuthRequired Props
```typescript
interface AuthRequiredProps {
  children: ReactNode;           // Button oder Element das geschützt werden soll
  action: string;               // Action-Key aus permissions.ts
  loginPrompt?: string;         // Custom Login-Text (optional)
  fallback?: ReactNode;         // Alternative wenn nicht authentifiziert
  onAuthSuccess?: () => void;   // Callback nach erfolgreichem Login
}
```

### LoginPrompt Props
```typescript
interface LoginPromptProps {
  isOpen: boolean;              // Modal-Zustand
  onClose: () => void;          // Schließen-Callback
  onLoginSuccess?: () => void;  // Erfolgs-Callback
  message?: string;             // Custom Message
  redirectAfterLogin?: string;  // Redirect-Action nach Login
}
```

## 🎯 Use Cases & Patterns

### Pattern 1: Einfacher Button-Schutz
```tsx
// Vorher: Direkter Auth-Check
const { user } = useOptimizedAuth();
if (!user) return <LoginRedirect />;

// Nachher: AuthRequired Wrapper
<AuthRequired action="create_order">
  <Button>Bestellen</Button>
</AuthRequired>
```

### Pattern 2: Komplexe Formulare
```tsx
function OrderForm() {
  return (
    <form>
      {/* Öffentlich: Formular ausfüllen */}
      <Input placeholder="Von..." />
      <Input placeholder="Nach..." />
      
      {/* Geschützt: Nur Submit-Button */}
      <AuthRequired action="create_order">
        <Button type="submit">Auftrag erstellen</Button>
      </AuthRequired>
    </form>
  );
}
```

### Pattern 3: Bedingte UI
```tsx
function TransportCard({ driver }) {
  return (
    <Card>
      {/* Öffentlich: Driver-Info */}
      <h3>{driver.name}</h3>
      <p>{driver.vehicle}</p>
      
      {/* Geschützt: Kontakt-Button */}
      <AuthRequired action="contact_driver">
        <Button>Kontakt aufnehmen</Button>
      </AuthRequired>
    </Card>
  );
}
```

### Pattern 4: Nach-Login Actions
```tsx
function BookingButton({ transportId }) {
  const handleBooking = () => {
    // Diese Funktion wird erst nach Login ausgeführt
    bookTransport(transportId);
  };

  return (
    <AuthRequired 
      action="book_transport"
      onAuthSuccess={handleBooking}
    >
      <Button>Jetzt buchen</Button>
    </AuthRequired>
  );
}
```

## 🧪 Testing

### Unit Tests
```typescript
// AuthRequired testen
it('should show login prompt for protected action', () => {
  render(
    <AuthRequired action="create_order">
      <Button>Test Button</Button>
    </AuthRequired>
  );
  
  fireEvent.click(screen.getByText('Test Button'));
  expect(screen.getByText('Anmeldung erforderlich')).toBeInTheDocument();
});
```

### Integration Tests
```typescript
// End-to-End Flow testen
it('should complete action after login', async () => {
  // 1. Public browsing
  render(<TransportSearch />);
  expect(screen.getByText('Alle Angebote')).toBeInTheDocument();
  
  // 2. Trigger protected action
  fireEvent.click(screen.getByText('Transportanfrage erstellen'));
  expect(screen.getByText('Anmeldung erforderlich')).toBeInTheDocument();
  
  // 3. Complete login
  await login('test@example.com', 'password');
  
  // 4. Action should be executed
  expect(screen.getByText('Anfrage wurde erstellt')).toBeInTheDocument();
});
```

## 🚫 Anti-Patterns vermeiden

### ❌ Falsch: Auth-Checks in Business Logic
```tsx
function CreateButton() {
  const { user } = useOptimizedAuth();
  
  if (!user) {
    return <LoginButton />;
  }
  
  return <Button onClick={handleCreate}>Erstellen</Button>;
}
```

### ✅ Richtig: AuthRequired Wrapper
```tsx
function CreateButton() {
  return (
    <AuthRequired action="create_item">
      <Button onClick={handleCreate}>Erstellen</Button>
    </AuthRequired>
  );
}
```

### ❌ Falsch: Ganze Seiten schützen
```tsx
function ItemPage() {
  const { user } = useOptimizedAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <ItemContent />;
}
```

### ✅ Richtig: Nur Aktionen schützen
```tsx
function ItemPage() {
  return (
    <div>
      {/* Öffentlich: Anzeigen */}
      <ItemDisplay />
      
      {/* Geschützt: Interaktion */}
      <AuthRequired action="contact_seller">
        <Button>Verkäufer kontaktieren</Button>
      </AuthRequired>
    </div>
  );
}
```

## 🔄 Migration bestehender Komponenten

### Schritt 1: Auth-Checks identifizieren
```bash
# Suche nach Auth-Verwendung
grep -r "useOptimizedAuth" src/
grep -r "ProtectedRoute" src/
grep -r "user &&" src/
```

### Schritt 2: AuthRequired einsetzen
```tsx
// Vorher
const { user } = useOptimizedAuth();
return user ? <ActionButton /> : <LoginPrompt />;

// Nachher  
return (
  <AuthRequired action="action_name">
    <ActionButton />
  </AuthRequired>
);
```

### Schritt 3: Permissions definieren
```typescript
// In src/auth/permissions.ts
export const loginRequiredActions = {
  action_name: {
    action: "action_name",
    requiresLogin: true,
    description: "Beschreibung der Aktion"
  }
};
```

### Schritt 4: i18n hinzufügen
```json
// In src/i18n/locales/de/auth.json
{
  "login_required_for_action_name": "Für diese Aktion bitte anmelden"
}
```

## 📊 Performance Monitoring

### Auth-Events tracken
```typescript
// Analytics-Events für Auth-System
track('auth_required_triggered', {
  action: 'contact_driver',
  user_type: 'guest'
});

track('login_completed', {
  trigger_action: 'publish_item',
  login_method: 'email'
});

track('auth_action_completed', {
  action: 'submit_offer',
  time_to_complete: 1200
});
```

### Metrics sammeln
- **Conversion Rate**: Guest → Registered User
- **Action Trigger Rate**: Welche Aktionen triggern Login?
- **Drop-off Rate**: Wo brechen User den Login ab?
- **Time to Action**: Wie schnell nach Login erfolgt die Aktion?

---

**Best Practice**: Starte immer mit dem einfachsten Use Case und erweitere schrittweise. Das Auth-System ist darauf ausgelegt, sowohl einfache Buttons als auch komplexe Workflows zu unterstützen.


# Auth-System Troubleshooting

## 🐛 Häufige Probleme & Lösungen

### Problem 1: AuthRequired funktioniert nicht
**Symptom**: Button wird nicht geschützt, kein Login-Modal erscheint

**Ursachen & Lösungen**:
```tsx
// ❌ Falsch: Action nicht in permissions.ts definiert
<AuthRequired action="undefined_action">
  <Button>Test</Button>
</AuthRequired>

// ✅ Lösung: Action in permissions.ts hinzufügen
export const loginRequiredActions = {
  undefined_action: {
    action: "undefined_action", 
    requiresLogin: true,
    description: "Test action"
  }
};
```

### Problem 2: Login-Modal erscheint nicht
**Symptom**: Fehler in Console, Modal öffnet sich nicht

**Debug-Schritte**:
```tsx
// 1. Console-Log prüfen
console.log('AuthRequired triggered for action:', action);

// 2. Permission-Check testen
import { requiresAuthentication } from '@/auth/permissions';
console.log('Requires auth:', requiresAuthentication('your_action'));

// 3. LoginPrompt State prüfen
const [showLoginPrompt, setShowLoginPrompt] = useState(false);
console.log('Login prompt state:', showLoginPrompt);
```

### Problem 3: Nach Login kehrt User nicht zur Aktion zurück
**Symptom**: Login erfolgreich, aber ursprüngliche Aktion wird nicht ausgeführt

**Lösung**:
```tsx
// ✅ onAuthSuccess Callback verwenden
<AuthRequired 
  action="submit_offer"
  onAuthSuccess={() => {
    console.log('Auth successful, executing action');
    handleSubmitOffer();
  }}
>
  <Button>Angebot senden</Button>
</AuthRequired>
```

### Problem 4: i18n-Übersetzungen fehlen
**Symptom**: Login-Prompt zeigt Key statt Text

**Lösung**:
```json
// In src/i18n/locales/de/auth.json hinzufügen
{
  "login_required_for_your_action": "Für diese Aktion bitte anmelden"
}
```

```tsx
// In Komponente verwenden
const { t } = useTranslation(['auth']);

<AuthRequired 
  action="your_action"
  loginPrompt={t('auth:login_required_for_your_action')}
>
  <Button>Action</Button>
</AuthRequired>
```

### Problem 5: Public-Route wird fälschlicherweise geschützt
**Symptom**: Öffentliche Seite erfordert Login

**Debug**:
```tsx
// 1. Prüfe ob ProtectedRoute verwendet wird
// ❌ Entferne ProtectedRoute für öffentliche Seiten
<Route path="/search" element={
  <ProtectedRoute>
    <SearchPage />
  </ProtectedRoute>
} />

// ✅ Nur PublicRoute oder direktes Element
<Route path="/search" element={<SearchPage />} />
```

### Problem 6: RLS-Policies blockieren öffentliche Daten
**Symptom**: Öffentliche API-Calls schlagen fehl

**Debug**:
```sql
-- Prüfe RLS-Policies in Supabase
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Für öffentliche Daten: Policy hinzufügen
CREATE POLICY "Public read access" ON your_table 
FOR SELECT TO anon 
USING (is_public = true);
```

## 🔍 Debug-Tools

### 1. Auth-Debug-Panel (Entwicklung)
```tsx
// Temporäre Debug-Komponente
function AuthDebugPanel() {
  const { user, session } = useOptimizedAuth();
  
  return (
    <div className="fixed top-0 right-0 p-4 bg-yellow-100 text-xs">
      <h4>Auth Debug</h4>
      <p>User: {user ? '✅ Logged in' : '❌ Guest'}</p>
      <p>Session: {session ? '✅ Active' : '❌ None'}</p>
      <p>Role: {user?.role || 'guest'}</p>
    </div>
  );
}
```

### 2. Permission-Checker
```tsx
// Utility zum Testen von Permissions
import { loginRequiredActions } from '@/auth/permissions';

function PermissionChecker({ action }: { action: string }) {
  const config = loginRequiredActions[action];
  
  return (
    <div className="border p-2 text-sm">
      <strong>Action: {action}</strong>
      <p>Requires Login: {config?.requiresLogin ? '✅' : '❌'}</p>
      <p>Description: {config?.description || 'Not defined'}</p>
    </div>
  );
}
```

### 3. Console-Logging für AuthRequired
```tsx
// In AuthRequired.tsx für Debug
console.log('[AuthRequired]', {
  action,
  needsAuth,
  isAuthenticated: !!user,
  loginPrompt
});
```

## 📋 Checkliste für neue Features

### ✅ Vor Implementierung
- [ ] Action in `permissions.ts` definiert?
- [ ] i18n-Keys in `auth.json` hinzugefügt?
- [ ] AuthRequired um richtige Buttons gesetzt?
- [ ] Öffentliche vs. geschützte Bereiche klar getrennt?

### ✅ Nach Implementierung
- [ ] Public User Journey getestet?
- [ ] Login-Flow getestet?
- [ ] Nach-Login Action getestet?
- [ ] i18n in allen Sprachen getestet?
- [ ] Mobile-Ansicht getestet?

### ✅ Vor Deployment
- [ ] Console-Errors beseitigt?
- [ ] Auth-Debug-Code entfernt?
- [ ] Performance-Impact geprüft?
- [ ] RLS-Policies validiert?

## 🚨 Notfall-Debugging

### Auth-System komplett deaktivieren (Entwicklung)
```tsx
// Temporäre Lösung für Tests
function AuthRequired({ children, action, ...props }) {
  // WARNUNG: Nur für Development!
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }
  
  // ... normale AuthRequired Logik
}
```

### Session-Reset bei Problemen
```tsx
// Emergency Auth Reset
function EmergencyAuthReset() {
  const handleReset = async () => {
    // Alle Auth-Daten löschen
    localStorage.clear();
    sessionStorage.clear();
    
    // Supabase Session beenden
    await supabase.auth.signOut({ scope: 'global' });
    
    // Seite neu laden
    window.location.reload();
  };
  
  return (
    <Button onClick={handleReset} className="bg-red-500">
      🚨 Auth Reset (Emergency)
    </Button>
  );
}
```

## 📞 Support-Kontakte

**Bei technischen Problemen**:
1. Console-Logs sammeln
2. User-Journey dokumentieren  
3. Screenshots/Videos erstellen
4. Issue im Projekt erstellen

**Bei Supabase RLS-Problemen**:
1. SQL-Queries testen
2. Policy-Logs prüfen
3. Supabase Dashboard verwenden

---

**Tipp**: Die meisten Auth-Probleme entstehen durch fehlende Permission-Definitionen oder i18n-Keys. Prüfe diese zuerst!

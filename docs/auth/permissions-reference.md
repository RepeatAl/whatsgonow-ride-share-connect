# AuthRequired Permissions Reference

## 📋 Vollständige Aktionsliste

Diese Referenz listet alle verfügbaren `action` Werte für `<AuthRequired>` Komponenten auf.

### Transport & Logistik
```typescript
create_transport_request    // Transportanfrage erstellen
contact_driver             // Fahrer kontaktieren  
book_transport            // Transport buchen
accept_order              // Auftrag annehmen
cancel_order              // Auftrag stornieren
```

### Artikel & Veröffentlichung
```typescript
publish_item              // Artikel veröffentlichen
create_order              // Bestellung erstellen
save_draft               // Entwurf speichern
upload_verification      // Verifizierung hochladen
```

### Kommunikation
```typescript
start_chat               // Chat starten
send_message             // Nachricht senden
send_private_message     // Private Nachricht
submit_offer             // Angebot abgeben
submit_feedback          // Bewertung abgeben
```

### Profil & Daten
```typescript
save_profile             // Profil speichern
edit_profile             // Profil bearbeiten
view_address             // Vollständige Adresse anzeigen
enter_address            // Adresse eingeben
manage_payment           // Zahlungsdaten verwalten
```

### Support & Administration
```typescript
open_dispute             // Dispute eröffnen
contact_cm               // Community Manager kontaktieren
report_issue             // Problem melden
```

## 🔧 Verwendungsbeispiele

### Standard AuthRequired
```tsx
<AuthRequired action="publish_item" loginPrompt="Zum Veröffentlichen bitte anmelden">
  <Button>Artikel veröffentlichen</Button>
</AuthRequired>
```

### Mit Erfolgs-Callback
```tsx
<AuthRequired 
  action="contact_driver" 
  loginPrompt="Zum Kontaktieren bitte anmelden"
  onAuthSuccess={() => openChatModal()}
>
  <Button>Kontakt aufnehmen</Button>
</AuthRequired>
```

### Mit i18n
```tsx
<AuthRequired 
  action="submit_offer" 
  loginPrompt={t('auth:login_required_for_offer')}
>
  <Button>{t('offer:submit_offer')}</Button>
</AuthRequired>
```

## 🌍 i18n Keys

Für jeden Action sollte ein entsprechender i18n-Key existieren:

```json
{
  "login_required_for_transport_request": "Zum Erstellen einer Transportanfrage ist eine Anmeldung erforderlich.",
  "login_required_for_contact": "Zum Kontaktieren des Fahrers ist eine Anmeldung erforderlich.",
  "login_required_for_publish": "Zum Veröffentlichen bitte anmelden.",
  "login_required_for_offer": "Zum Absenden des Angebots bitte anmelden."
}
```

## ➕ Neue Aktionen hinzufügen

1. **Permission definieren** in `src/auth/permissions.ts`:
```typescript
export const loginRequiredActions = {
  // ... existing actions
  new_action: {
    action: "new_action",
    requiresLogin: true,
    description: "Beschreibung der neuen Aktion"
  }
};
```

2. **i18n-Übersetzung** hinzufügen:
```json
{
  "login_required_for_new_action": "Für diese neue Aktion bitte anmelden"
}
```

3. **Verwenden** in Komponenten:
```tsx
<AuthRequired action="new_action">
  <Button>Neue Aktion</Button>
</AuthRequired>
```

## 🚫 Öffentliche Aktionen

Diese Aktionen erfordern **KEIN** Login:
- `browse_items` - Artikel durchsuchen
- `search_transport` - Transport suchen
- `view_public_info` - Öffentliche Infos anzeigen
- `change_language` - Sprache wechseln
- `prepare_upload` - Upload vorbereiten

---

**Hinweis**: Diese Liste wird automatisch aus `src/auth/permissions.ts` generiert und sollte bei Änderungen aktualisiert werden.

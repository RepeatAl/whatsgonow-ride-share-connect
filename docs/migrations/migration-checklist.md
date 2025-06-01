
# Profile Visibility Migration - Checklist

## Pre-Migration (KRITISCH!)

### Backup & Staging
- [ ] **Vollständiger DB-Backup erstellt** (pg_dump mit --clean --create)
- [ ] **Staging-Environment** mit Prod-Daten getestet  
- [ ] **Migration auf Staging** erfolgreich durchgeführt
- [ ] **Rollback auf Staging** erfolgreich getestet

### System-Checks
- [ ] Aktuelle Supabase-Version kompatibel
- [ ] Keine laufenden Migrationen/Maintenance
- [ ] Ausreichend DB-Speicher verfügbar (neue Tabellen + Indizes)
- [ ] Connection-Pool-Limits geprüft

## Migration Execution

### Transaktion verwenden
```sql
BEGIN;
-- Hier die komplette Migration einfügen
-- Bei Fehlern: ROLLBACK;
COMMIT;
```

### Monitoring während Migration
- [ ] DB-Performance überwachen (CPU, Memory, Connections)
- [ ] Error-Logs in Echtzeit prüfen
- [ ] Keine User-Aktivität blockiert

## Post-Migration (VALIDIERUNG!)

### Funktionalitäts-Tests
- [ ] **RLS-Policies** funktionieren korrekt:
  ```sql
  -- Test als verschiedene User-Rollen
  SELECT * FROM profile_visibility_settings; -- Nur eigene sichtbar
  SELECT * FROM transaction_participants;     -- Nur relevante sichtbar
  ```

- [ ] **Helper-Funktionen** arbeiten korrekt:
  ```sql
  SELECT public.has_transaction_relationship('user1-uuid', 'user2-uuid');
  SELECT public.get_user_visibility_level('user-uuid', 'email');
  ```

- [ ] **Audit-Logging** aktiv:
  ```sql
  -- Nach Profil-Zugriff sollten Einträge in profile_access_audit stehen
  SELECT COUNT(*) FROM profile_access_audit WHERE accessed_at > NOW() - INTERVAL '1 hour';
  ```

### Performance-Validierung
- [ ] Indizes erstellt und aktiv:
  ```sql
  SELECT schemaname, tablename, indexname, indexdef 
  FROM pg_indexes 
  WHERE tablename IN ('profile_visibility_settings', 'transaction_participants', 'profile_access_audit');
  ```

- [ ] Query-Performance akzeptabel (< 100ms für typische Abfragen)

### Frontend-Integration
- [ ] Profile-Views laden ohne Fehler
- [ ] Privacy-Settings erreichbar
- [ ] Keine 403/404 Errors durch RLS

## Rollback-Plan (Falls nötig)

### Trigger-Kriterien für Rollback:
- Migration schlägt fehl (Constraint-Violations, etc.)
- RLS-Policies blockieren legitime User-Zugriffe  
- Performance-Degradation > 50%
- Frontend-Funktionalität defekt

### Rollback-Durchführung:
1. **Sofort** alle User informieren (Maintenance-Mode)
2. **Rollback-Script** ausführen: `profile-visibility-rollback.sql`
3. **System-Status prüfen** - alle Tabellen/Funktionen entfernt
4. **App-Restart** falls nötig (Cache-Clear)
5. **Incident-Report** erstellen

## Monitoring & Support

### Was überwachen (erste 24h):
- Error-Rate in System-Logs
- RLS-Policy-Violations
- Profile-Zugriffs-Latenz
- User-Beschwerden über fehlende Daten

### Support-Vorbereitung:
- [ ] Team über neue Privacy-Features informiert
- [ ] FAQ für User-Fragen zu Privacy-Settings
- [ ] Eskalations-Pfad für Datenschutz-Anfragen

---

**💡 Live-Einsatz Empfehlung:**
- **Zeitpunkt:** Wartungsfenster mit geringer User-Aktivität
- **Team:** Mindestens 2 Devs online während Migration  
- **Kommunikation:** User rechtzeitig über neue Privacy-Features informieren
- **Monitoring:** Erste 2-4 Stunden intensiv überwachen


# 🧷 Whatsgonow – Rollen & IDs (Verbindliche Konvention)

## Rollen
- `super_admin` = Super-Admin mit Vollrechten
- `admin` = Admin ohne kritische Systemrechte
- `cm` = Community Manager
- `sender_private` = Privater Auftraggeber
- `sender_business` = Geschäftlicher Auftraggeber
- `driver` = Fahrer

## Primäre User-ID
- `user_id` = Supabase Auth UID (auth.uid())
- `profile_id` wird nicht verwendet – stattdessen `profiles.user_id` als Schlüssel

## Rollenprüfung
- `profile.role` = Zugriffsebene
- `region` = nur für cm relevant (Regionsfilter in Policies verwenden)

## Beziehungsfelder (immer mit _id)

| Beziehung         | Verwenden          | Nicht verwenden     |
|------------------|-------------------|-------------------|
| Auftraggeber     | `sender_id`        | `sender`           |
| Fahrer           | `driver_id`        | `driver`           |
| Empfänger        | `recipient_id`     | `recipient`        |
| Bewertender      | `from_user_id`     | `from_user`        |
| Bewerteter       | `to_user_id`       | `to_user`          |
| Ersteller        | `creator_id`       | `creator`          |
| Besitzer         | `owner_id`         | `owner`            |

## Timestamps
- Verwende immer `created_at` und `updated_at` als Zeitstempel
- Format: `timestamp with time zone` (mit Zeitzone)
- Default für `created_at`: `now()`
- Default für `updated_at`: `now()` mit Trigger für Aktualisierung

```sql
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON table_name
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
```

## Zugriffslogik
- RLS-Policies prüfen über: `auth.uid()` = `target_table.user_id`
- Rollen prüfen über: `profile.role IN (...)`
- Community Manager Region Filter: `EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'cm' AND profiles.region = target_table.region)`

## Automatisierte Tests
- Alle RLS-Policies müssen in `src/utils/rls-testing/role-access-tester.ts` getestet werden
- Testuser für alle Rollen in `src/utils/rls-testing/types.ts` definieren
- Neue Tabellen immer in `tableTests` in dieser Datei ergänzen
- Die RLS-Testseite unter `/rls-test` verwenden, um Policies zu testen

## Migrationsstrategie
- Feldumbenennung folgt dem Schema:
  ```sql
  ALTER TABLE table_name RENAME COLUMN old_name TO new_name;
  ```
- Beispiel: `from_user` → `from_user_id`, `to_user` → `to_user_id` in `ratings`
- Bei Eliminierung von `profile_id` zugunsten von `user_id`:
  ```sql
  ALTER TABLE table_name RENAME COLUMN profile_id TO user_id;
  ```

## Umgang mit bestehendem Code
- Bestehenden Code schrittweise anpassen
- Neue Migrationen müssen diesem Standard folgen
- Alte Codepassagen werden mit TODO-Kommentaren markiert
- Priorität: Sicherheitsrelevante Policies und Authentifizierungslogik

## Sicherheitshinweise und Validierung
- Jede neue RLS-Policy muss validiert werden
- Keine direkten Vergleiche mit `'super_admin'` etc., stattdessen `role IN ('super_admin', 'admin')`
- Kritische Operationen brauchen explizite `role='super_admin'`-Checks
- NULL-Werte in Schlüsselfeldern vermeiden (NOT NULL constraints)
- Immer prüfen: Kann ein Nutzer Daten verändern, die ihm nicht gehören?

## Dokumentationspflicht
- Jede RLS-Policy-Datei (*.sql) muss folgenden Kommentar enthalten:
  ```sql
  -- Diese Policy folgt den Konventionen aus /docs/conventions/roles_and_ids.md
  ```
- Alle neuen Supabase-Migrationen müssen auf dieses Dokument verweisen
- Alle neuen *.tsx-Komponenten mit Rollen-/RLS-Zugriff müssen dieses Dokument referenzieren

## Verwandte Dokumente
- [Rollenabhängigkeiten](/docs/system/role_dependencies.md) - Detaillierte Matrix über Rollen, Berechtigungen und Komponenten
- [Role Alignment Checklist](/docs/refactor/role_alignment_checklist.md) - Status der Code-Anpassung an diese Konventionen

## Automatisierte Überprüfung
Das Projekt verwendet einen automatisierten Check für die Einhaltung der Konventionen:
```bash
npx ts-node scripts/check-role-consistency.ts
```
Dieser Check wird auch bei Pull Requests über GitHub Actions ausgeführt und muss bestanden werden.

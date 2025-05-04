
# 📘 Rollenabhängigkeiten – Whatsgonow

Diese Datei dokumentiert alle relevanten Abhängigkeiten zwischen Rollen, Datenobjekten und Komponenten.
Ziel: Einheitliche Zugriffskontrolle, Refactoring-Sicherheit, klare Prüfpfade bei Änderungen.

---

### 🧷 Rollenübersicht

| Rolle           | Beschreibung                              | Sichtbarkeitsfilter          |
|----------------|--------------------------------------------|------------------------------|
| super_admin    | Vollzugriff auf alle Daten und Funktionen | keine                        |
| admin          | Eingeschränkter Admin ohne Sicherheitsrechte | keine                        |
| cm             | Community Manager (regionale Betreuung)   | Zugriff auf `region = cm.region` |
| sender_private | Privater Auftraggeber                     | Zugriff auf eigene `user_id` |
| sender_business| Gewerblicher Auftraggeber                 | Zugriff auf eigene `user_id` |
| driver         | Fahrer mit Fahrzeugregistrierung          | Zugriff auf eigene `user_id` |

---

### 🔐 Zugriffsmatrix (technisch)

| Datenobjekt       | Zugriff durch           | Einschränkungen                            | Verwendete Policy / Funktion            |
|------------------|-------------------------|---------------------------------------------|-----------------------------------------|
| profiles          | super_admin, cm         | `region = cm.region` für cm                 | RLS: EXISTS(SELECT 1 FROM profiles...)   |
| orders            | sender, cm, super_admin | `user_id = auth.uid()` oder region-match   | RLS: orders_user_check, region_filter   |
| ratings           | alle Rollen             | nur eigene Bewertungen sehen/geben         | RLS: ratings_view_check                 |
| role_change_logs  | super_admin             | keine                                       | RLS: only_super_admin_view              |
| messages          | sender, driver, cm      | `user_id IN (sender_id, driver_id)`        | RLS: message_role_access                |
| feedback          | cm, super_admin         | nur Feedback in eigener Region             | RLS: feedback_region_filter             |

---

### 🧩 Komponenten-Mapping

| Komponente                      | Rolle(n)          | Abhängige Daten         | Hinweise                                               |
|--------------------------------|-------------------|-------------------------|--------------------------------------------------------|
| `RoleManager.tsx`              | super_admin       | profiles, role_change_logs | Nutzt assign_role(), Audit-Funktion aktiv             |
| `CommunityManager.tsx`         | cm                | users, region           | Zeigt Badge + Warnung bei fehlender Region            |
| `UserList.tsx`, `UserRow.tsx`  | cm                | profiles                | Zeigt nur Nutzer in Region                            |
| `RLSTest.tsx`                  | alle              | alle Tabellen           | Tabs nach Rolle, Regionfilter für CM                  |
| `RateUser.tsx`                 | alle              | ratings                 | Bewertet über from_user_id / to_user_id               |
| `RatingsTabContent.tsx`        | alle              | ratings                 | Zeigt Bewertungen, prüft Struktur dynamisch           |
| `use-fetch-users.ts`           | admin, cm         | profiles                | Muss region beachten, ggf. filterbar machen           |
| `role-access-tester.ts`        | alle              | diverse                 | Enthält Rollentests + Validierung                     |

---

### 🚦 Standardfilter pro Rolle

```sql
-- Für CM
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role = 'cm'
  AND profiles.region = target_table.region
)

-- Für eigene Daten
auth.uid() = target_table.user_id

-- Für Super-Admin-Only
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role = 'super_admin'
)
```

---

**Letzte Aktualisierung:** 4. Mai 2025
**Autor:** CTO (automatisiert generiert aus Live-Systemprüfung)

Bitte alle neuen Komponenten und Tabellen hier dokumentieren!

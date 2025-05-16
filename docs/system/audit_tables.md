
# Audit-Tabellen in Whatsgonow

Diese Dokumentation beschreibt die verschiedenen Audit-Tabellen im Whatsgonow-System und deren Verwendungszwecke.

## Übersicht

Whatsgonow verwendet mehrere spezialisierte Audit-Tabellen für unterschiedliche Zwecke:

| Tabelle | Zweck | Zugriffsberechtigungen | Primäre Nutzung |
|---------|-------|------------------------|-----------------|
| `system_logs` | Allgemeines System-Auditing | Admin, Super_Admin | Backend, Fehleranalyse |
| `user_flag_audit` | Nutzer-Flagging Historie | CM, Admin, Super_Admin | Frontend-Anzeige, Eskalation |
| `trust_score_audit` | Trust Score Änderungen | CM, Admin, Super_Admin | Frontend-Anzeige, Risikobewertung |
| `role_change_logs` | Rollenänderungen | Admin, Super_Admin | Admin-Interface |
| `invoice_audit_log` | Rechnungsänderungen | Admin, Super_Admin | Buchhaltung, Compliance |

## Detaillierte Beschreibungen

### 1. user_flag_audit

**Zweck:** Speichert alle Nutzer-Flagging Aktionen (Markieren und Entmarkieren) durch Community Manager und Admins.

**Struktur:**
```
id: UUID (PK)
user_id: UUID (FK auf profiles)
flagged: BOOLEAN
reason: TEXT
actor_id: UUID (FK auf profiles)
role: TEXT
created_at: TIMESTAMP WITH TIME ZONE
```

**Besonderheiten:**
- Dedizierte Tabelle für Frontend-Anzeige im CM-Interface
- Vollständige Historie aller Flagging-Aktionen
- Basis für Eskalationsstufenmodell in Phase 6

**Zugriff:** 
- Lesen: CM, Admin, Super_Admin
- Schreiben: Intern durch Systemfunktionen

### 2. system_logs

**Zweck:** Zentrale Logging-Tabelle für systemweite Ereignisse.

**Struktur:**
```
log_id: UUID (PK)
event_type: TEXT
entity_type: TEXT
entity_id: UUID
actor_id: TEXT
metadata: JSONB
severity: TEXT
visible_to: TEXT[]
created_at: TIMESTAMP WITH TIME ZONE
```

**Besonderheiten:**
- Allgemeines System-Auditing
- Flexibles Schema durch JSONB metadata
- Kategorisierung durch event_type und entity_type
- Differenzierte Sichtbarkeit durch visible_to Array

**Zugriff:**
- Lesen: Admin, Super_Admin
- Schreiben: Intern durch Systemfunktionen

## Verhältnis zwischen Audit-Tabellen

### user_flag_audit vs. system_logs

- **user_flag_audit**: Spezialisiert und optimiert für Frontend-Darstellung der Flagging-Historie
- **system_logs**: Allgemeines Logging für systemweite Ereignisse und Administration

**Wichtig:** Bei Nutzer-Flagging werden Einträge primär in `user_flag_audit` gespeichert. Bei kritischen Flagging-Ereignissen (z.B. wiederholtes Flagging, Systemempfehlung) werden zusätzlich Einträge in `system_logs` mit höherer Schwere erstellt.

### Datenfluss und Konsistenz

- Flagging-Aktionen werden zuerst in `user_flag_audit` gespeichert
- Nur bei relevanten Schwellenwerten oder Eskalation erfolgt zusätzlicher Eintrag in `system_logs`
- Diese Trennung vermeidet Duplizierung bei normalen Operationen und sichert gleichzeitig kritische Events im zentralen Log

## Best Practices

1. **Frontend-Anzeigen:**
   - Für UI-Komponenten primär spezialisierte Audit-Tabellen verwenden
   - Beispiel: FlagHistoryDialog.tsx nutzt `user_flag_audit`

2. **Reporting & Administration:**
   - Für administrative Übersichten `system_logs` verwenden
   - Beispiel: Administrations-Dashboard zeigt kritische Events aus system_logs

3. **Erweiterungen:**
   - Neue Audit-Funktionen sollten spezialisierte Tabellen nutzen
   - Kritische Events zusätzlich in `system_logs` protokollieren

4. **Performance:**
   - Queries auf `user_flag_audit` sind schneller und zielgerichteter als auf `system_logs`
   - Für UI-Komponenten indexes auf häufig abgefragte Felder setzen

## Zukünftige Entwicklung (Phase 6)

- Integration von Eskalationsstufen basierend auf `user_flag_audit`
- Automatisierte Benachrichtigungen bei Schwellenwert-Überschreitungen
- Erweiterte Statistiken für Community Manager Dashboard


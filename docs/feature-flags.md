# Feature Flags System - Dokumentation

## Übersicht

Das Feature Flag System ermöglicht die sichere Ein-/Ausschaltung neuer Features ohne Deployment. Es bietet vollständige Audit-Trails, Rollback-Funktionalität und Environment-spezifische Konfiguration.

## Architektur

### Komponenten
- **Database**: `feature_flags` und `feature_flag_audit` Tabellen in Supabase
- **Config**: `src/config/featureFlags.ts` - Zentrale Definitionen und Fallbacks
- **Hook**: `src/hooks/useFeatureFlags.ts` - React Hook für Flag-Management
- **Admin UI**: `src/components/admin/FeatureFlagManager.tsx` - Management-Interface

### Sicherheit
- RLS (Row Level Security) auf allen Tabellen
- Admins können Flags verwalten, Users nur lesen
- Vollständige Audit-Trails für Compliance (GoBD)

## Verfügbare Feature Flags

| Flag Name | Beschreibung | Standard | Kategorie |
|-----------|--------------|----------|-----------|
| `analytics_events_v2` | Enhanced Analytics Events mit Zod Validierung | `true` | analytics |
| `video_analytics_tracking` | Video-spezifisches Analytics Tracking | `true` | analytics |
| `language_analytics_tracking` | Sprach-Wechsel Analytics Tracking | `true` | analytics |
| `analytics_error_monitoring` | Enhanced Error Monitoring für Analytics | `true` | monitoring |
| `analytics_validation_dashboard` | Admin Dashboard für Analytics Validierung | `false` | admin |
| `experimental_analytics_features` | Experimentelle Analytics Features | `false` | experimental |

## Verwendung

### Im Code prüfen

```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

function MyComponent() {
  const { isFeatureEnabled } = useFeatureFlags();
  
  if (isFeatureEnabled('analytics_events_v2')) {
    // Feature ist aktiviert
    return <EnhancedAnalytics />;
  }
  
  return <LegacyAnalytics />;
}
```

### Mit Feature Gate Component

```typescript
import { FeatureGate } from '@/hooks/useFeatureFlags';

function App() {
  return (
    <FeatureGate 
      flag="analytics_validation_dashboard"
      fallback={<p>Feature nicht verfügbar</p>}
    >
      <AnalyticsValidationDashboard />
    </FeatureGate>
  );
}
```

### Analytics-spezifische Flags

```typescript
import { useAnalyticsFeatureFlags } from '@/hooks/useFeatureFlags';

function AnalyticsComponent() {
  const flags = useAnalyticsFeatureFlags();
  
  if (flags.videoTracking) {
    trackVideoEvent('video_started', videoId);
  }
}
```

## Environment-spezifische Konfiguration

### Development
- `analytics_validation_dashboard`: `true`
- `experimental_analytics_features`: `true`

### Staging
- `experimental_analytics_features`: `true`

### Production
- `experimental_analytics_features`: `false`

## Admin-Management

### Zugriff
1. Admin-Dashboard öffnen
2. Feature Flags Sektion navigieren
3. Flags ein-/ausschalten mit Begründung

### Rollback
- Sofortige Deaktivierung über Admin-UI
- Audit-Trail zeigt alle Änderungen
- Auto-Rollback bei Error-Threshold (zukünftig)

## Fallback-Strategie

1. **Database verfügbar**: Flags aus Supabase laden
2. **Database nicht verfügbar**: Environment-basierte Fallbacks aus `FEATURE_FLAG_DEFAULTS`
3. **Unbekannte Flags**: Standard `false` mit Warnung

## Monitoring

### Health Check
```sql
SELECT * FROM check_feature_flag_health();
```

### Audit Trail
```typescript
const { getAuditHistory } = useFeatureFlags();
const history = await getAuditHistory('analytics_events_v2');
```

## Best Practices

### Neue Flags hinzufügen

1. **Flag definieren** in `src/config/featureFlags.ts`:
```typescript
export type FeatureFlagName = 
  | 'analytics_events_v2'
  | 'my_new_feature'; // Neue Flag

export const FEATURE_FLAG_DEFAULTS: Record<FeatureFlagName, boolean> = {
  // ... existing flags
  my_new_feature: false, // Konservativ starten
};
```

2. **Flag in Database einfügen**:
```sql
INSERT INTO feature_flags (flag_name, enabled, description, category, scope)
VALUES ('my_new_feature', false, 'Beschreibung des Features', 'experimental', 'global');
```

3. **Im Code verwenden**:
```typescript
if (isFeatureEnabled('my_new_feature')) {
  // Neue Funktionalität
}
```

### Rollout-Strategie

1. **Flag erstellen** (disabled)
2. **Code deployieren** mit Feature Gates
3. **Testing** in Development/Staging
4. **Gradueller Rollout** in Production
5. **Monitoring** der Audit-Logs und Health-Metrics
6. **Cleanup** alter Flags nach vollständigem Rollout

## Compliance & Audit

### GoBD-Konformität
- Vollständige Änderungshistorie
- Unveränderlichkeit der Audit-Logs
- Zeitstempel und User-Tracking
- Begründung für alle Änderungen

### Retention
- Audit-Logs: Unbegrenzt (GoBD-Anforderung)
- Archivierte Flags: Soft Delete mit `archived_at`
- Export-Funktionalität für Compliance-Berichte (geplant)

## Troubleshooting

### Häufige Probleme

1. **Flag nicht verfügbar**: Prüfe Environment und Database-Connection
2. **Änderungen werden nicht übernommen**: Real-time Subscription prüfen
3. **Permission Denied**: User-Rolle und RLS-Policies prüfen

### Debug-Informationen

```typescript
const { flags, loading, error, environment, health } = useFeatureFlags();
console.log('Debug Info:', { flags, loading, error, environment, health });
```

## Roadmap

### Phase 2 (Q3 2025)
- Auto-Rollback bei Error-Thresholds
- User-spezifische und Rollen-basierte Flags
- A/B Testing Framework

### Phase 3 (Q4 2025)
- Percentage-based Rollouts
- Integration mit externem Monitoring (Sentry)
- API für externe Flag-Management

---

**Letzte Aktualisierung**: 31. Mai 2025  
**Version**: 1.0  
**Maintainer**: CTO Team

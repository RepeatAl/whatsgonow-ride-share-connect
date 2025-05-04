
# Audit-Event-Katalog

Dieses Dokument katalogisiert alle Audit-Event-Typen, die im Whatsgonow-System verwendet werden. Es dient als zentrale Referenz für Entwickler und Administratoren.

## Event-Typen-Hierarchie

Die Event-Typen sind nach Funktionsbereichen organisiert:

1. **Order/Deal Events** - Ereignisse im Zusammenhang mit Aufträgen und Verhandlungen
2. **Delivery Events** - Ereignisse im Zusammenhang mit Lieferungen
3. **Payment Events** - Ereignisse im Zusammenhang mit Zahlungen
4. **User Events** - Ereignisse im Zusammenhang mit Nutzern
5. **Support/Admin Events** - Ereignisse im Zusammenhang mit Support und Administration
6. **Security Events** - Sicherheitsrelevante Ereignisse

## Vollständige Event-Typ-Liste

### Order/Deal Events

| Event-Typ | Beschreibung | Severity | Retention |
|-----------|-------------|----------|-----------|
| `ORDER_CREATED` | Neuer Auftrag erstellt | INFO | 90 Tage |
| `OFFER_SUBMITTED` | Angebot für einen Auftrag abgegeben | INFO | 90 Tage |
| `DEAL_PROPOSED` | Verhandlung für einen Auftrag vorgeschlagen | INFO | 90 Tage |
| `DEAL_COUNTER_PROPOSED` | Gegenangebot in einer Verhandlung | INFO | 90 Tage |
| `DEAL_ACCEPTED` | Angebot/Verhandlung akzeptiert | CRITICAL | 10 Jahre |
| `DEAL_REJECTED` | Angebot/Verhandlung abgelehnt | INFO | 90 Tage |
| `DEAL_EXPIRED` | Verhandlung abgelaufen (Zeitlimit) | WARN | 180 Tage |
| `ORDER_CANCELLED` | Auftrag vom Ersteller storniert | WARN | 180 Tage |
| `ORDER_EXPIRED` | Auftrag automatisch abgelaufen | INFO | 90 Tage |

### Delivery Events

| Event-Typ | Beschreibung | Severity | Retention |
|-----------|-------------|----------|-----------|
| `QR_GENERATED` | QR-Code für einen Auftrag generiert | INFO | 90 Tage |
| `QR_SCANNED` | QR-Code gescannt | CRITICAL | 10 Jahre |
| `QR_BACKUP_USED` | Backup-Code anstelle von QR verwendet | CRITICAL | 10 Jahre |
| `DELIVERY_STARTED` | Lieferung gestartet | INFO | 90 Tage |
| `DELIVERY_COMPLETED` | Lieferung abgeschlossen | CRITICAL | 10 Jahre |
| `DELIVERY_CONFIRMED` | Lieferung vom Empfänger bestätigt | CRITICAL | 10 Jahre |
| `DELIVERY_FAILED` | Lieferung fehlgeschlagen | WARN | 180 Tage |

### Payment Events

| Event-Typ | Beschreibung | Severity | Retention |
|-----------|-------------|----------|-----------|
| `PAYMENT_RESERVED` | Zahlung reserviert | CRITICAL | 10 Jahre |
| `PAYMENT_RELEASED` | Zahlung freigegeben | CRITICAL | 10 Jahre |
| `PAYMENT_FAILED` | Zahlung fehlgeschlagen | CRITICAL | 10 Jahre |
| `PAYMENT_REFUNDED` | Zahlung zurückerstattet | CRITICAL | 10 Jahre |

### User Events

| Event-Typ | Beschreibung | Severity | Retention |
|-----------|-------------|----------|-----------|
| `USER_REGISTERED` | Neuer Nutzer registriert | INFO | 90 Tage |
| `USER_VERIFIED` | Nutzeridentität verifiziert | WARN | 180 Tage |
| `PROFILE_UPDATED` | Nutzerprofil aktualisiert | INFO | 90 Tage |
| `USER_DEACTIVATED` | Nutzer deaktiviert | WARN | 180 Tage |
| `USER_REACTIVATED` | Nutzer reaktiviert | INFO | 90 Tage |
| `USER_DELETED` | Nutzer gelöscht (DSGVO) | CRITICAL | 10 Jahre |

### Support/Admin Events

| Event-Typ | Beschreibung | Severity | Retention |
|-----------|-------------|----------|-----------|
| `SUPPORT_TICKET_CREATED` | Support-Ticket erstellt | INFO | 90 Tage |
| `DISPUTE_OPENED` | Streitfall eröffnet | CRITICAL | 10 Jahre |
| `DISPUTE_RESOLVED` | Streitfall gelöst | CRITICAL | 10 Jahre |
| `FORCE_MAJEURE_ACTIVATED` | Force Majeure aktiviert | CRITICAL | 10 Jahre |
| `ADMIN_ACTION` | Administrative Aktion | CRITICAL | 10 Jahre |
| `STATUS_CHANGED` | Status einer Entität geändert | Variabel | Nach Kontext |
| `STAGING_STATE_EXPIRED` | Zwischenstatus abgelaufen | WARN | 180 Tage |

### Security Events

| Event-Typ | Beschreibung | Severity | Retention |
|-----------|-------------|----------|-----------|
| `FAILED_LOGIN_ATTEMPT` | Fehlgeschlagener Anmeldeversuch | WARN | 180 Tage |
| `UNUSUAL_ACCESS_PATTERN` | Ungewöhnliches Zugriffsverhalten | CRITICAL | 10 Jahre |
| `ROLE_CHANGED` | Nutzerrolle geändert | CRITICAL | 10 Jahre |
| `API_ACCESS_DENIED` | API-Zugriff verweigert | WARN | 180 Tage |

## Severity-Level und Retention-Zeiten

| Severity | Beschreibung | Standard-Retention |
|----------|-------------|-------------------|
| `INFO` | Normale Betriebsereignisse | 90 Tage |
| `WARN` | Warnungen und potenzielle Probleme | 180 Tage |
| `CRITICAL` | Kritische Geschäftsereignisse, rechtlich relevant | 10 Jahre (GoBD-konform) |

## Integration im Code

Die Event-Typen sind in `src/constants/auditEvents.ts` als TypeScript-Enums definiert:

```typescript
export enum AuditEventType {
  // Order/Deal Events
  ORDER_CREATED = 'ORDER_CREATED',
  OFFER_SUBMITTED = 'OFFER_SUBMITTED',
  // ... andere Event-Typen
}

export enum AuditSeverity {
  INFO = 'INFO',
  WARN = 'WARN',
  CRITICAL = 'CRITICAL'
}
```

## Einsatz mit dem Audit-Hook

Beispiel für die Verwendung eines Events mit dem `useSystemAudit`-Hook:

```typescript
const { logEvent } = useSystemAudit();

// Ein kritisches Ereignis loggen
await logEvent({
  eventType: AuditEventType.FORCE_MAJEURE_ACTIVATED,
  entityType: AuditEntityType.ORDER,
  entityId: orderId,
  actorId: adminId,
  metadata: { 
    reason: 'Naturkatastrophe',
    refundAmount: 250.00
  },
  severity: AuditSeverity.CRITICAL
});
```

## Datenzugriff und Sichtbarkeit

Die Sichtbarkeit von Audit-Events wird durch das `visible_to`-Feld gesteuert:

| Rolle | Sichtbare Events |
|-------|-----------------|
| `super_admin` | Alle Events |
| `admin` | Alle Events außer bestimmte Security-Events |
| `cm` | Ereignisse in ihrer Region (INFO, WARN, ausgewählte CRITICAL) |
| `sender_private`, `sender_business`, `driver` | Nur eigene Ereignisse (INFO) |

## Alerts und Benachrichtigungen

Kritische Events (`CRITICAL`) lösen automatisch Benachrichtigungen aus:

1. **Direkte UI-Benachrichtigungen** für eingeloggte Admins
2. **E-Mail-Benachrichtigungen** für dringende Fälle (Force Majeure, Zahlungsfehler)
3. **Admin-Dashboard-Updates** in Echtzeit

## Reporting

Die Audit-Events können über folgende Schnittstellen abgefragt werden:

1. **Admin-Dashboard** - Filterbares Audit-Log-Interface
2. **API-Endpunkt** - Zugriffsgeschützte Schnittstelle für Berichte
3. **Edge-Functions** - Für automatisierte Berichte und Analysen

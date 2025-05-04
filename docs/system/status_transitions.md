
# Status-Übergangssystem

Diese Dokumentation beschreibt das zentrale Status-Übergangssystem der Whatsgonow-Plattform. Sie dient als Referenz für Entwickler, um zu verstehen, welche Status-Übergänge für verschiedene Entitäten erlaubt sind und welche Berechtigungen für diese Übergänge erforderlich sind.

## Inhaltsverzeichnis

1. [Einführung](#einführung)
2. [Status-Definitionen](#status-definitionen)
   - [Auftrags-Status (Order)](#auftrags-status-order)
   - [Angebots-Status (Deal)](#angebots-status-deal)
   - [Streitfall-Status (Dispute)](#streitfall-status-dispute)
3. [Erlaubte Status-Übergänge](#erlaubte-status-übergänge)
   - [Auftrags-Übergänge](#auftrags-übergänge)
   - [Angebots-Übergänge](#angebots-übergänge)
   - [Streitfall-Übergänge](#streitfall-übergänge)
4. [Berechtigungskonzept](#berechtigungskonzept)
5. [API und Implementierung](#api-und-implementierung)
6. [Audit-Logging](#audit-logging)
7. [Best Practices](#best-practices)

## Einführung

Das Status-Übergangssystem ist ein zentraler Bestandteil der Geschäftslogik von Whatsgonow. Es definiert, welche Status-Übergänge für verschiedene Entitäten (Aufträge, Angebote, Streitfälle) erlaubt sind und welche Berechtigungen für diese Übergänge erforderlich sind.

Die Hauptvorteile dieses Systems sind:

- **Konsistenz**: Durch zentrale Definition der erlaubten Übergänge wird eine konsistente Anwendungslogik gewährleistet.
- **Sicherheit**: Das System verhindert unerlaubte Status-Änderungen durch Benutzer ohne entsprechende Berechtigungen.
- **Transparenz**: Audit-Logs zeichnen alle Status-Änderungen auf und ermöglichen Nachvollziehbarkeit.
- **Erweiterbarkeit**: Das System ist so konzipiert, dass es einfach um neue Status und Übergänge erweitert werden kann.

## Status-Definitionen

### Auftrags-Status (Order)

| Status | Code | Beschreibung |
|--------|------|-------------|
| Erstellt | `created` | Der Auftrag wurde erstellt, aber noch nicht zur Angebotsfindung freigegeben |
| Angebote ausstehend | `offer_pending` | Der Auftrag ist zur Angebotsfindung freigegeben |
| Angebot angenommen | `deal_accepted` | Ein Angebot wurde vom Auftraggeber angenommen |
| Vom Auftraggeber bestätigt | `confirmed_by_sender` | Der Auftraggeber hat die Abholung bestätigt |
| In Lieferung | `in_delivery` | Der Fahrer hat die Abholung bestätigt, Transport läuft |
| Ausgeliefert | `delivered` | Der Fahrer hat die Auslieferung bestätigt |
| Abgeschlossen | `completed` | Der Auftraggeber hat den erfolgreichen Abschluss bestätigt |
| Im Streitfall | `dispute` | Ein Streitfall wurde eröffnet |
| Force Majeure (storniert) | `force_majeure_cancelled` | Stornierung durch höhere Gewalt |
| Storniert | `cancelled` | Regulär storniert |
| Abgelaufen | `expired` | Der Auftrag ist ohne Annahme abgelaufen |
| Gelöst | `resolved` | Ein Streitfall wurde gelöst |

### Angebots-Status (Deal)

| Status | Code | Beschreibung |
|--------|------|-------------|
| Vorgeschlagen | `proposed` | Ein Angebot wurde abgegeben |
| Gegenangebot | `counter` | Ein Gegenangebot wurde abgegeben |
| Angenommen | `accepted` | Das Angebot wurde angenommen |
| Abgelehnt | `rejected` | Das Angebot wurde abgelehnt |
| Abgelaufen | `expired` | Das Angebot ist abgelaufen |

### Streitfall-Status (Dispute)

| Status | Code | Beschreibung |
|--------|------|-------------|
| Offen | `open` | Ein Streitfall wurde eröffnet |
| In Prüfung | `under_review` | Der Streitfall wird bearbeitet |
| Eskaliert | `escalated` | Der Streitfall wurde eskaliert |
| Gelöst | `resolved` | Der Streitfall wurde gelöst |

## Erlaubte Status-Übergänge

### Auftrags-Übergänge

```
created → offer_pending → deal_accepted → confirmed_by_sender → in_delivery → delivered → completed
    ↓                        ↓                    ↓                  ↓             ↓
cancelled                   dispute              dispute           dispute       dispute
    ↓                                                                               ↓
  [Ende]                                                                         resolved
                                                                                    ↓
                                                                           force_majeure_cancelled
```

| Von | Zu | Begründung |
|-----|---|------------|
| created | offer_pending | Auftraggeber gibt Auftrag zur Angebotssuche frei |
| created | cancelled | Auftraggeber kann Auftrag vor Angebotsphase stornieren |
| offer_pending | deal_accepted | Angebot wurde angenommen |
| offer_pending | expired | Automatischer Übergang bei Zeitablauf ohne Annahme |
| deal_accepted | confirmed_by_sender | Auftraggeber bestätigt finale Details für Abholung |
| confirmed_by_sender | in_delivery | Fahrer bestätigt Abholung |
| in_delivery | delivered | Fahrer bestätigt Auslieferung |
| in_delivery | dispute | Problem während der Lieferung |
| delivered | completed | Auftraggeber bestätigt erfolgreichen Abschluss |
| delivered | dispute | Problem nach der Auslieferung |
| dispute | resolved | Streitfall wurde gelöst |
| dispute | force_majeure_cancelled | Stornierung aufgrund höherer Gewalt |

### Angebots-Übergänge

```
proposed → counter → accepted
    ↓         ↓         ↓
rejected   rejected    [Ende]
    ↓         ↓
  [Ende]    [Ende]
```

| Von | Zu | Begründung |
|-----|---|------------|
| proposed | counter | Gegenangebot wurde erstellt |
| proposed | accepted | Angebot wurde direkt angenommen |
| proposed | rejected | Angebot wurde abgelehnt |
| proposed | expired | Automatischer Übergang bei Zeitablauf |
| counter | counter | Weiteres Gegenangebot wurde erstellt |
| counter | accepted | Gegenangebot wurde angenommen |
| counter | rejected | Gegenangebot wurde abgelehnt |
| counter | expired | Automatischer Übergang bei Zeitablauf |

### Streitfall-Übergänge

```
open → under_review → resolved
              ↓
          escalated → resolved
```

| Von | Zu | Begründung |
|-----|---|------------|
| open | under_review | Community-Manager nimmt Bearbeitung auf |
| under_review | resolved | Streitfall wurde gelöst |
| under_review | escalated | Streitfall wurde an höhere Instanz eskaliert |
| escalated | resolved | Streitfall wurde nach Eskalation gelöst |

## Berechtigungskonzept

Die folgende Tabelle zeigt, welche Benutzerrollen berechtigt sind, bestimmte Status-Übergänge durchzuführen:

### Auftrags-Berechtigungen

| Von | Zu | Erlaubte Rollen |
|-----|---|-----------------|
| created | offer_pending | sender_private, sender_business |
| created | cancelled | sender_private, sender_business |
| offer_pending | deal_accepted | sender_private, sender_business |
| offer_pending | expired | system |
| deal_accepted | confirmed_by_sender | sender_private, sender_business |
| confirmed_by_sender | in_delivery | driver |
| in_delivery | delivered | driver |
| in_delivery | dispute | driver, sender_private, sender_business |
| delivered | completed | sender_private, sender_business |
| delivered | dispute | driver, sender_private, sender_business |
| dispute | resolved | cm, admin, super_admin |
| dispute | force_majeure_cancelled | admin, super_admin |

Spezielle Rollen wie `system` und `super_admin` haben grundsätzlich alle Berechtigungen.

## API und Implementierung

Das Status-Übergangssystem wird über die zentrale Utility-Datei `src/utils/status-transition.ts` implementiert. Diese bietet folgende Hauptfunktionen:

### Status-Enums

```typescript
// Auftrags-Status
export enum OrderStatus {
  CREATED = 'created',
  OFFER_PENDING = 'offer_pending',
  // ...weitere Status
}

// Angebots-Status
export enum DealStatus {
  PROPOSED = 'proposed',
  COUNTER = 'counter',
  // ...weitere Status
}

// Streitfall-Status
export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  // ...weitere Status
}
```

### Statusüberprüfungsfunktion

Die zentrale Funktion zur Validierung von Status-Übergängen ist:

```typescript
export function isValidStatusTransition(
  entityType: EntityType,
  fromStatus: string, 
  toStatus: string
): boolean
```

Diese Funktion sollte vor jeder Status-Änderung verwendet werden, um sicherzustellen, dass der Übergang zulässig ist.

### Berechtigungsprüfung

```typescript
export function hasPermissionForStatusChange(
  entityType: EntityType,
  fromStatus: string,
  toStatus: string,
  userRole: string
): boolean
```

### Status-Änderung durchführen

```typescript
export async function performStatusChange(
  entityType: EntityType,
  entityId: string,
  fromStatus: string,
  toStatus: string,
  userId: string,
  userRole: string,
  metadata: Record<string, any> = {}
): Promise<{ success: boolean; error?: string }>
```

Diese Funktion kombiniert Validierung, Berechtigungsprüfung, Datenbankaktualisierung und Audit-Logging.

## Audit-Logging

Alle Status-Änderungen werden automatisch im Audit-Log erfasst. Dies erfolgt über den `useSystemAudit`-Hook, der folgende Informationen protokolliert:

- Ereignistyp (z.B. `STATUS_CHANGED`)
- Entitätstyp (order, deal, dispute)
- Entitäts-ID
- Akteur-ID (Benutzer, der die Änderung durchführt)
- Metadaten (u.a. alter und neuer Status)
- Zeitstempel

## Best Practices

1. **Immer Validierung verwenden**: Verwende immer `isValidStatusTransition` vor Status-Änderungen:
   ```typescript
   if (!isValidStatusTransition('order', order.status, newStatus)) {
     throw new Error(`Ungültiger Statusübergang: ${order.status} → ${newStatus}`);
   }
   ```

2. **Immer Berechtigungen prüfen**: Verwende immer `hasPermissionForStatusChange` vor Status-Änderungen:
   ```typescript
   if (!hasPermissionForStatusChange('order', order.status, newStatus, user.role)) {
     throw new Error(`Keine Berechtigung für Statusübergang`);
   }
   ```

3. **Zentrale Funktion nutzen**: Verwende wenn möglich die kombinierte Funktion `performStatusChange`:
   ```typescript
   const result = await performStatusChange(
     'order',
     orderId,
     order.status,
     newStatus,
     userId,
     userRole
   );
   if (!result.success) {
     console.error(result.error);
   }
   ```

4. **Status-Enums verwenden**: Nutze immer die definierten Enums statt String-Literale:
   ```typescript
   // Gut
   if (order.status === OrderStatus.CREATED) { ... }
   
   // Vermeiden
   if (order.status === 'created') { ... }
   ```

5. **Fehlerbehandlung**: Fange Status-Änderungsfehler ordnungsgemäß ab und informiere den Benutzer:
   ```typescript
   try {
     await performStatusChange(...);
   } catch (error) {
     toast.error(`Status konnte nicht geändert werden: ${error.message}`);
   }
   ```

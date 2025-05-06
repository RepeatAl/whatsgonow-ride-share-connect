
# XRechnung Parameter Standards

Dieses Dokument beschreibt die Standards für die Verwendung von xRechnungService-Methoden im Projekt.

## Wichtige Regeln

1. **Object-Parameter Format**: Alle Methoden von `xRechnungService` müssen mit einem einzigen Object-Parameter aufgerufen werden.

   ```typescript
   // ✓ RICHTIG:
   await xRechnungService.sendXRechnungEmail({
     orderId: '123',
     email: 'test@behörde.de',
     recipientName: 'Behördenname'
   });

   // ✗ FALSCH:
   await xRechnungService.sendXRechnungEmail('123', 'test@behörde.de', 'Behördenname');
   ```

2. **Konsistente Benennung**: Verwende immer die folgenden Parameternamen:
   - `orderId` für die Auftrags-ID
   - `email` für die E-Mail-Adresse
   - `recipientName` für den Namen des Empfängers

## Implementierte Checks

Um sicherzustellen, dass diese Standards eingehalten werden, haben wir folgende Maßnahmen implementiert:

### ESLint-Regel

Eine benutzerdefinierte ESLint-Regel `custom-rules/xrechnung-object-params` prüft, ob alle Aufrufe von `xRechnungService`-Methoden das Object-Parameter Format verwenden.

### TypeScript Tests

Tests in `tests/services/xRechnungService.test.ts` stellen sicher, dass die Methodensignaturen korrekt sind und TypeScript-Fehler bei falscher Verwendung erzeugt werden.

### CI-Pipeline Check

Ein GitHub Action Workflow `xrechnung-param-check.yml` führt sowohl einen Grep-Check als auch den ESLint-Check durch, um falsche Verwendungen zu erkennen.

## Warum Object-Parameter?

Object-Parameter bieten mehrere Vorteile:

1. **Bessere Lesbarkeit**: Parameter sind selbstdokumentierend durch ihre Namen
2. **Flexibilität**: Parameter können in beliebiger Reihenfolge angegeben werden
3. **Erweiterbarkeit**: Neue Parameter können hinzugefügt werden, ohne bestehende Aufrufe zu ändern
4. **TypeScript-Unterstützung**: Bessere Typsicherheit und Auto-Completion

## Entwickler-Hinweise

- Bei Fehlern im CI beachte die Ausgabe des Grep-Checks und der ESLint-Prüfung
- Die VS Code ESLint-Extension kann diese Probleme bereits während der Entwicklung anzeigen
- Der automatische Fix mit `--fix` kann einige einfache Fälle automatisch korrigieren

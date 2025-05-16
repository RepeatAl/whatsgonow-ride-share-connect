
# User Flagging System - Technische Implementierung

Diese Dokumentation beschreibt die technische Implementierung des User Flagging Systems für Community Manager in der Whatsgonow-Plattform.

## Systemübersicht

Das User Flagging System ermöglicht es Community Managern (CMs) und Administratoren, Nutzerprofile als "kritisch" zu markieren, um potenziell problematische Accounts zu identifizieren und zu überwachen.

### Kernfunktionalitäten

1. Nutzer als kritisch markieren (flaggen) mit Begründung
2. Nutzer entmarkieren (unflag)
3. Vollständige Audit-Historie aller Markierungen
4. Visuelle Hervorhebung markierter Nutzer in Listen
5. Filterung nach markierten Nutzern
6. Anzeige der Markierungshistorie

## Datenbank-Design

### Flagging-Daten in profiles Tabelle

```sql
ALTER TABLE profiles ADD COLUMN flagged_by_cm BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN flagged_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN flag_reason TEXT;
```

Diese Felder speichern den aktuellen Status einer Markierung direkt im Nutzerprofil.

### Audit-Tabelle für die Flagging-Historie

```sql
CREATE TABLE IF NOT EXISTS public.user_flag_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(user_id),
  flagged BOOLEAN,
  reason TEXT,
  actor_id UUID REFERENCES profiles(user_id),
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_flag_audit_user ON public.user_flag_audit(user_id);
```

Diese Tabelle speichert den vollständigen Verlauf aller Flagging-Aktionen.

### Row-Level Security

```sql
ALTER TABLE public.user_flag_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CM/Admin can view flag audit" ON public.user_flag_audit
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) IN ('admin', 'super_admin', 'cm')
);
```

RLS stellt sicher, dass nur berechtigte Rollen auf die Audit-Daten zugreifen können.

## Backend-Funktionen

### flag_user

```sql
CREATE OR REPLACE FUNCTION public.flag_user(target_user_id UUID, flag_reason TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  requesting_user_id UUID := auth.uid();
  requesting_user_role TEXT;
BEGIN
  -- Prüfe Berechtigung des anfragenden Nutzers
  SELECT role INTO requesting_user_role
  FROM profiles
  WHERE user_id = requesting_user_id;
  
  IF requesting_user_role NOT IN ('cm', 'admin', 'super_admin') THEN
    RETURN FALSE;
  END IF;

  -- Markiere Nutzer
  UPDATE profiles
  SET 
    flagged_by_cm = TRUE,
    flagged_at = now(),
    flag_reason = COALESCE(flag_reason, 'Keine Begründung angegeben')
  WHERE user_id = target_user_id;

  -- Erstelle Audit-Eintrag
  INSERT INTO public.user_flag_audit (
    user_id, flagged, reason, actor_id, role
  ) VALUES (
    target_user_id, TRUE, flag_reason, requesting_user_id, requesting_user_role
  );
  
  RETURN TRUE;
END;
$$;
```

### unflag_user

```sql
CREATE OR REPLACE FUNCTION public.unflag_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  requesting_user_id UUID := auth.uid();
  requesting_user_role TEXT;
BEGIN
  -- Prüfe Berechtigung des anfragenden Nutzers
  SELECT role INTO requesting_user_role
  FROM profiles
  WHERE user_id = requesting_user_id;
  
  IF requesting_user_role NOT IN ('cm', 'admin', 'super_admin') THEN
    RETURN FALSE;
  END IF;

  -- Entmarkiere Nutzer
  UPDATE profiles
  SET 
    flagged_by_cm = FALSE,
    flagged_at = NULL,
    flag_reason = NULL
  WHERE user_id = target_user_id;

  -- Erstelle Audit-Eintrag
  INSERT INTO public.user_flag_audit (
    user_id, flagged, reason, actor_id, role
  ) VALUES (
    target_user_id, FALSE, NULL, requesting_user_id, requesting_user_role
  );
  
  RETURN TRUE;
END;
$$;
```

## Frontend-Implementierung

### Hooks

#### useUserFlagging

```typescript
// src/hooks/use-user-flagging.ts
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface FlaggingOptions {
  reason: string;
}

export function useUserFlagging() {
  // ... implmentiert flagUser und unflagUser Funktionen
  // ... prüft Berechtigungen (canFlag)
  // ... verwaltet Ladezustand
}
```

#### useFlagHistory

```typescript
// src/hooks/use-flag-history.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface FlagHistoryEntry {
  id: string;
  user_id: string;
  flagged: boolean;
  reason: string | null;
  actor_id: string;
  role: string;
  created_at: string;
  actor_name?: string; // Optional: Name des CM/Admin aus profiles
}

export function useFlagHistory(userId: string) {
  const [history, setHistory] = useState<FlagHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // ... lädt Flagging-Historie aus user_flag_audit
  // ... optional: verknüpft mit profiles, um CM-Namen zu laden
  
  return { history, loading, error };
}
```

### Komponenten

#### UserFlaggingControls

```typescript
// src/components/community-manager/UserFlaggingControls.tsx
// ... Switch zur Markierung/Entmarkierung von Nutzern
// ... Dialog zur Eingabe einer Begründung
// ... Verarbeitung von flag_user/unflag_user Aktionen
```

#### FlagHistoryDialog

```typescript
// src/components/flagging/FlagHistoryDialog.tsx
// ... Dialog zur Anzeige des Flagging-Verlaufs
// ... Button zum Öffnen des Dialogs
```

#### FlagHistory

```typescript
// src/components/flagging/FlagHistory.tsx
// ... Darstellung der Flagging-Einträge
// ... Farbliche Kennzeichnung (rot/grün)
// ... Anzeige von CM-Name, Rolle, Zeit, Begründung
```

## Integration

### User List und User Details

```typescript
// src/components/community-manager/UserDetailsExpander.tsx
// ... Anzeige des Flagging-Status
// ... Button zum Öffnen des Flagging-Dialogs
// ... Button zum Öffnen der Flagging-Historie
```

### Beziehung zu Trust Score System

```typescript
// src/components/community-manager/UserRow.tsx
// ... Visuelle Indikatoren für markierte Nutzer
// ... Kombinierte Anzeige von Trust Score und Flagging-Status
// ... Tooltip mit Details zur Markierung
```

## Best Practices

### 1. Performance-Optimierung

- Verwende Pagination bei langen Historien
- Setze sinnvolle Limits (z.B. maximal 50 Einträge)
- Nutze Eager Loading für Actor-Namen, um N+1 Query Problem zu vermeiden

### 2. Fehlerbehandlung

- Zeige aussagekräftige Fehlermeldungen bei fehlenden Berechtigungen
- Fallback-Anzeige bei Ladeproblemen der Historie
- Validierung von Eingaben (z.B. leere Begründungen verhindern)

### 3. UX-Empfehlungen

- Markierte Nutzer deutlich hervorheben (Farbkodierung, Symbole)
- Filter für "Nur markierte Nutzer anzeigen" prominent platzieren
- Historie chronologisch sortieren (neueste zuerst)

## Erweiterungsmöglichkeiten

### Phase 6

- Automatische Flagging-Empfehlungen basierend auf Trust Score und Aktivitätsmustern
- Mehrere Eskalationsstufen (z.B. Warnung, Beobachtung, Sperrung)
- Integration mit Benachrichtigungssystem für Admin-Alerts


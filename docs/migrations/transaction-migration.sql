
-- ================================================================
-- SICHERE TRANSAKTIONS-MIGRATION
-- Profile Visibility Architecture - Production Ready
-- ================================================================
-- 
-- Diese Migration läuft als EINE Transaktion für maximale Konsistenz
-- Bei Fehlern wird automatisch alles zurückgerollt
-- 
-- Geschätzte Laufzeit: 2-5 Minuten (je nach DB-Größe)
-- Speicherbedarf: ~50MB für Indizes und Metadaten
-- ================================================================

BEGIN;

-- Setze Timeout für die gesamte Migration (10 Minuten)
SET LOCAL statement_timeout = '10min';

-- Logge Migration-Start
DO $$
BEGIN
    RAISE NOTICE 'Profile Visibility Migration gestartet um %', now();
END $$;

-- Phase 1: Tabellen erstellen
-- ================================================================

-- 1. Tabelle: profile_visibility_settings
CREATE TABLE profile_visibility_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    field_name TEXT NOT NULL,
    visibility_level TEXT CHECK (visibility_level IN ('public', 'private', 'transaction', 'admin')) NOT NULL,
    opt_in BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, field_name)
);

-- 2. Tabelle: transaction_participants  
CREATE TABLE transaction_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    counterparty_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) NOT NULL DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    
    UNIQUE(order_id, user_id, counterparty_id)
);

-- 3. Tabelle: profile_access_audit
CREATE TABLE profile_access_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accessed_by UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
    accessed_user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
    access_type TEXT NOT NULL,
    order_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    accessed_fields JSONB,
    accessed_at TIMESTAMPTZ DEFAULT now()
);

RAISE NOTICE 'Tabellen erfolgreich erstellt um %', now();

-- Phase 2: Indizes erstellen
-- ================================================================

-- Performance-Indizes für profile_visibility_settings
CREATE INDEX idx_profile_visibility_user_id ON profile_visibility_settings(user_id);
CREATE INDEX idx_profile_visibility_level ON profile_visibility_settings(visibility_level);

-- Performance-Indizes für transaction_participants
CREATE INDEX idx_transaction_participants_user_id ON transaction_participants(user_id);
CREATE INDEX idx_transaction_participants_counterparty ON transaction_participants(counterparty_id);
CREATE INDEX idx_transaction_participants_order_id ON transaction_participants(order_id);
CREATE INDEX idx_transaction_participants_status ON transaction_participants(status);

-- Indizes für profile_access_audit
CREATE INDEX idx_profile_access_accessed_by ON profile_access_audit(accessed_by);
CREATE INDEX idx_profile_access_target ON profile_access_audit(accessed_user_id);
CREATE INDEX idx_profile_access_type ON profile_access_audit(access_type);
CREATE INDEX idx_profile_access_date ON profile_access_audit(accessed_at);

RAISE NOTICE 'Indizes erfolgreich erstellt um %', now();

-- Phase 3: RLS-Policies
-- ================================================================

-- RLS für profile_visibility_settings
ALTER TABLE profile_visibility_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own visibility settings" 
ON profile_visibility_settings 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all visibility settings" 
ON profile_visibility_settings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin', 'cm')
  )
);

-- RLS für transaction_participants
ALTER TABLE transaction_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transaction relationships" 
ON transaction_participants 
FOR SELECT 
USING (user_id = auth.uid() OR counterparty_id = auth.uid());

CREATE POLICY "System can manage transaction relationships" 
ON transaction_participants 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- RLS für profile_access_audit
ALTER TABLE profile_access_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their profile access logs" 
ON profile_access_audit 
FOR SELECT 
USING (accessed_user_id = auth.uid());

CREATE POLICY "Admins can view all access logs" 
ON profile_access_audit 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "System can create audit logs" 
ON profile_access_audit 
FOR INSERT 
WITH CHECK (true);

RAISE NOTICE 'RLS-Policies erfolgreich erstellt um %', now();

-- Phase 4: Funktionen und Trigger
-- ================================================================

-- Trigger-Funktion für Timestamps
CREATE OR REPLACE FUNCTION update_profile_visibility_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger anwenden
CREATE TRIGGER update_profile_visibility_settings_updated_at
  BEFORE UPDATE ON profile_visibility_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_visibility_updated_at();

-- Helper-Funktionen
CREATE OR REPLACE FUNCTION public.has_transaction_relationship(user_a UUID, user_b UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM transaction_participants tp
    WHERE tp.status = 'active'
    AND (
      (tp.user_id = user_a AND tp.counterparty_id = user_b) OR
      (tp.user_id = user_b AND tp.counterparty_id = user_a)
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_visibility_level(target_user_id UUID, field_name TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT visibility_level FROM profile_visibility_settings 
     WHERE user_id = target_user_id AND field_name = field_name AND opt_in = true),
    'public'
  );
$$;

RAISE NOTICE 'Funktionen und Trigger erfolgreich erstellt um %', now();

-- Phase 5: Dokumentation und Kommentare
-- ================================================================

COMMENT ON TABLE profile_visibility_settings IS 'Speichert individuelle Privacy-Einstellungen pro User und Profilfeld';
COMMENT ON TABLE transaction_participants IS 'Verknüpft User mit aktiven Geschäftsbeziehungen für temporäre erweiterte Datensichtbarkeit';
COMMENT ON TABLE profile_access_audit IS 'DSGVO-konforme Protokollierung aller Profilzugriffe für Transparenz und Compliance';

-- Phase 6: Validierung
-- ================================================================

-- Prüfe ob alle Tabellen existieren
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_name IN ('profile_visibility_settings', 'transaction_participants', 'profile_access_audit')
    AND table_schema = 'public';
    
    IF table_count != 3 THEN
        RAISE EXCEPTION 'Nicht alle Tabellen wurden erstellt. Erwartet: 3, Gefunden: %', table_count;
    END IF;
    
    RAISE NOTICE 'Validierung erfolgreich: Alle % Tabellen erstellt', table_count;
END $$;

-- Logge Migration-Ende
DO $$
BEGIN
    RAISE NOTICE 'Profile Visibility Migration erfolgreich abgeschlossen um %', now();
    RAISE NOTICE 'Nächste Schritte: TypeScript-Integration und API-Endpunkte';
END $$;

-- ================================================================
-- Migration erfolgreich! 
-- Alle Änderungen werden als eine Transaktion committed.
-- ================================================================

COMMIT;

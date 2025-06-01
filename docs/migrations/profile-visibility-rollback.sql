
-- ================================================================
-- ROLLBACK SCRIPT für Profile Visibility Architecture
-- Migration: profile-visibility-foundation.sql  
-- ================================================================
-- 
-- WICHTIG: Dieses Skript nur im Notfall ausführen!
-- Alle Privacy-Einstellungen und Audit-Logs gehen verloren!
-- 
-- Empfehlung: Vor Rollback Daten-Export durchführen:
-- pg_dump --table=profile_visibility_settings [connection]
-- pg_dump --table=transaction_participants [connection] 
-- pg_dump --table=profile_access_audit [connection]
-- ================================================================

BEGIN;

-- 1. Drop alle RLS Policies (in umgekehrter Reihenfolge)
DROP POLICY IF EXISTS "System can create audit logs" ON profile_access_audit;
DROP POLICY IF EXISTS "Admins can view all access logs" ON profile_access_audit;
DROP POLICY IF EXISTS "Users can view their profile access logs" ON profile_access_audit;

DROP POLICY IF EXISTS "System can manage transaction relationships" ON transaction_participants;
DROP POLICY IF EXISTS "Users can view own transaction relationships" ON transaction_participants;

DROP POLICY IF EXISTS "Admins can view all visibility settings" ON profile_visibility_settings;
DROP POLICY IF EXISTS "Users can manage own visibility settings" ON profile_visibility_settings;

-- 2. Drop Trigger
DROP TRIGGER IF EXISTS update_profile_visibility_settings_updated_at ON profile_visibility_settings;

-- 3. Drop Funktionen
DROP FUNCTION IF EXISTS public.get_user_visibility_level(UUID, TEXT);
DROP FUNCTION IF EXISTS public.has_transaction_relationship(UUID, UUID);
DROP FUNCTION IF EXISTS update_profile_visibility_updated_at();

-- 4. Drop Tabellen (in umgekehrter Dependency-Reihenfolge)
DROP TABLE IF EXISTS profile_access_audit CASCADE;
DROP TABLE IF EXISTS transaction_participants CASCADE;
DROP TABLE IF EXISTS profile_visibility_settings CASCADE;

-- 5. Aufräumen: Eventuell erstellte Indizes (falls manuell angelegt)
-- (Werden automatisch mit Tabellen gelöscht, hier nur zur Sicherheit)

COMMIT;

-- ================================================================
-- Post-Rollback Checks
-- ================================================================
-- 
-- Nach dem Rollback sollten folgende Queries KEINE Ergebnisse liefern:
-- SELECT * FROM information_schema.tables WHERE table_name IN 
--   ('profile_visibility_settings', 'transaction_participants', 'profile_access_audit');
-- 
-- SELECT * FROM information_schema.routines WHERE routine_name IN
--   ('has_transaction_relationship', 'get_user_visibility_level');
-- ================================================================

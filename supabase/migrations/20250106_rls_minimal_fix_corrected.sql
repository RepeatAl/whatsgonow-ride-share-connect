
-- KORRIGIERTE RLS-BEREINIGUNG für profiles Tabelle
-- Behebung: WITH CHECK kann nicht bei SELECT oder DELETE verwendet werden

-- Schritt 1: Alle bestehenden Policies löschen
DROP POLICY IF EXISTS "Users can only see own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin users can see all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin users can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "authenticated_users_all_access" ON public.profiles;
DROP POLICY IF EXISTS "Allow own profile read" ON public.profiles;
DROP POLICY IF EXISTS "Allow own profile update" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read for map" ON public.profiles;
DROP POLICY IF EXISTS "Public read for maps" ON public.profiles;

-- Schritt 2: RLS neu aktivieren
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Schritt 3: Minimal-funktionsfähige Policies erstellen
-- User können ihr eigenes Profil lesen
CREATE POLICY "Allow own profile read" ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- User können ihr eigenes Profil aktualisieren  
CREATE POLICY "Allow own profile update" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- User können ihr eigenes Profil erstellen
CREATE POLICY "Allow own profile insert" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Super Admin hat vollen Zugriff (using SUPER_ADMIN_ID from types/auth.ts)
CREATE POLICY "Super admin full access" ON public.profiles
  FOR ALL
  USING (auth.uid() = '0ddb52f9-0e7a-4c53-8ae7-fca1209cd300'::uuid);

-- Öffentlicher lesender Zugriff für Map (KORRIGIERT: kein WITH CHECK bei SELECT)
CREATE POLICY "Public read for maps" ON public.profiles
  FOR SELECT
  USING (true);

-- Log der kritischen Änderung
INSERT INTO system_logs (
  entity_type,
  entity_id,
  event_type,
  severity,
  metadata
) VALUES (
  'system',
  'profiles_rls_minimal_fix_corrected',
  'rls_policies_simplified',
  'CRITICAL',
  jsonb_build_object(
    'action', 'rls_minimal_policies_restored_corrected',
    'reason', 'fix_auth_system_blockage',
    'timestamp', now(),
    'policies_created', ARRAY[
      'Allow own profile read',
      'Allow own profile update', 
      'Allow own profile insert',
      'Super admin full access',
      'Public read for maps'
    ]
  )
);


-- NOTFALL-MIGRATION: RLS komplett deaktivieren für sofortigen Login-Zugriff
-- Datum: 2025-01-06
-- Zweck: Login-Probleme durch RLS-Rekursion beheben

-- Schritt 1: Alle problematischen RLS-Policies entfernen
DROP POLICY IF EXISTS "Users can only see own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin users can see all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin users can update all profiles" ON public.profiles;

-- Schritt 2: RLS komplett deaktivieren
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Schritt 3: Temporäre einfache Policies für Basis-Sicherheit
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Sehr einfache, nicht-rekursive Policy nur für authenticated users
CREATE POLICY "authenticated_users_all_access" ON public.profiles
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Log der Änderung
INSERT INTO system_logs (
  entity_type,
  entity_id,
  event_type,
  severity,
  metadata
) VALUES (
  'system',
  'rls_emergency_disable',
  'emergency_rls_simplification',
  'CRITICAL',
  jsonb_build_object(
    'action', 'rls_emergency_disable',
    'reason', 'infinite_recursion_fix',
    'timestamp', now(),
    'policies_removed', ARRAY['Users can only see own profile', 'Users can insert own profile', 'Users can update own profile', 'Admin users can see all profiles', 'Admin users can update all profiles'],
    'new_policy', 'authenticated_users_all_access'
  )
);

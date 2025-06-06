
-- PHASE 2: Restore handle_new_user trigger for automatic profile creation
-- Ziel: Neue Benutzer bekommen automatisch ein Profil bei Registrierung

-- Schritt 1: Prüfen ob Trigger bereits existiert und ggf. löschen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Schritt 2: Trigger-Funktion neu erstellen (verbesserte Version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  first_name text := new.raw_user_meta_data->>'first_name';
  last_name text := new.raw_user_meta_data->>'last_name';
  full_name text;
BEGIN
  -- Set full name from components
  IF first_name IS NOT NULL OR last_name IS NOT NULL THEN
    full_name := concat_ws(' ', first_name, last_name);
  ELSE
    full_name := new.raw_user_meta_data->>'name';
    
    IF full_name IS NULL THEN
      full_name := 'New User';
    END IF;
  END IF;

  INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    phone,
    role,
    company_name,
    region,
    postal_code,
    city,
    street,
    house_number,
    address_extra,
    profile_complete,
    onboarding_complete
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(first_name, ''),
    COALESCE(last_name, ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'sender_private'),
    new.raw_user_meta_data->>'company_name',
    COALESCE(new.raw_user_meta_data->>'region', ''),
    COALESCE(new.raw_user_meta_data->>'postal_code', ''),
    COALESCE(new.raw_user_meta_data->>'city', ''),
    new.raw_user_meta_data->>'street',
    new.raw_user_meta_data->>'house_number',
    new.raw_user_meta_data->>'address_extra',
    false,
    false
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Schritt 3: Trigger erstellen
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Schritt 4: Log der Reparatur  
INSERT INTO system_logs (
  entity_type,
  entity_id,
  event_type,
  severity,
  metadata
) VALUES (
  'system',
  gen_random_uuid(),
  'user_trigger_restored',
  'CRITICAL',
  jsonb_build_object(
    'action', 'handle_new_user_trigger_restored',
    'reason', 'automatic_profile_creation_fix',
    'timestamp', now(),
    'phase', '2_of_5'
  )
);

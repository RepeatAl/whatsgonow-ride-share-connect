
-- Diese Migration folgt den Konventionen aus /docs/conventions/roles_and_ids.md
-- Migration zur Umbenennung der Felder from_user und to_user in der ratings-Tabelle

-- Umbenennen von from_user zu from_user_id
ALTER TABLE ratings 
RENAME COLUMN from_user TO from_user_id;

-- Umbenennen von to_user zu to_user_id
ALTER TABLE ratings 
RENAME COLUMN to_user TO to_user_id;

-- Vorhandene Policies müssen ebenfalls aktualisiert werden, um auf die neuen Feldnamen zu verweisen
DO $$
BEGIN
    -- Überprüfe und aktualisiere vorhandene Policies
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ratings' AND policyname = 'Users can view their own ratings'
    ) THEN
        DROP POLICY "Users can view their own ratings" ON ratings;
        CREATE POLICY "Users can view their own ratings" 
        ON ratings FOR SELECT 
        USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'ratings' AND policyname = 'Users can only rate after an order'
    ) THEN
        DROP POLICY "Users can only rate after an order" ON ratings;
        CREATE POLICY "Users can only rate after an order" 
        ON ratings FOR INSERT 
        WITH CHECK (auth.uid() = from_user_id);
    END IF;

    -- Diese Policy folgt den Konventionen aus /docs/conventions/roles_and_ids.md
END $$;

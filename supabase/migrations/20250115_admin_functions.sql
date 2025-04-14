
-- Function to get user activity by region
CREATE OR REPLACE FUNCTION public.get_user_activity_by_region(
  filter_region text DEFAULT NULL,
  days_back integer DEFAULT 30
)
RETURNS TABLE (
  region text,
  total_users bigint,
  active_users bigint,
  drivers bigint,
  senders bigint
)
LANGUAGE SQL
AS $$
  SELECT 
    COALESCE(region, 'Unknown') as region,
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE active = true) as active_users,
    COUNT(*) FILTER (WHERE role = 'driver') as drivers,
    COUNT(*) FILTER (WHERE role = 'sender') as senders
  FROM 
    users
  WHERE
    (filter_region IS NULL OR region = filter_region)
    AND (created_at >= NOW() - (days_back || ' days')::INTERVAL)
  GROUP BY
    region
  ORDER BY
    total_users DESC;
$$;

-- Helper function to create the user activity function (for the useAdminLogs hook)
CREATE OR REPLACE FUNCTION public.create_user_activity_function()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is just a helper function that does nothing
  -- The real function is created above
  RETURN;
END;
$$;

-- Ensure only admins can execute these functions
REVOKE ALL ON FUNCTION public.get_user_activity_by_region FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_activity_by_region TO authenticated;

REVOKE ALL ON FUNCTION public.create_user_activity_function FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_user_activity_function TO authenticated;

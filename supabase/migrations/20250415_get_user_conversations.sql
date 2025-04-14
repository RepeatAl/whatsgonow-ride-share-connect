
-- Function to get a user's conversations with the most recent message
CREATE OR REPLACE FUNCTION public.get_user_conversations(user_id_param UUID)
RETURNS TABLE (
  order_id UUID,
  order_description TEXT,
  participant_id UUID,
  participant_name TEXT,
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  unread_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH recent_messages AS (
    SELECT DISTINCT ON (order_id)
      m.order_id,
      m.content,
      m.sent_at,
      CASE
        WHEN m.sender_id = user_id_param THEN m.recipient_id
        ELSE m.sender_id
      END AS other_user_id,
      o.description as order_desc
    FROM
      messages m
    JOIN
      orders o ON m.order_id = o.order_id
    WHERE
      m.sender_id = user_id_param OR m.recipient_id = user_id_param
    ORDER BY
      m.order_id, m.sent_at DESC
  ),
  unread_counts AS (
    SELECT
      order_id,
      COUNT(*) as unread
    FROM
      messages
    WHERE
      recipient_id = user_id_param
      AND NOT read
    GROUP BY
      order_id
  )
  SELECT
    rm.order_id,
    rm.order_desc,
    rm.other_user_id,
    u.name,
    rm.content,
    rm.sent_at,
    COALESCE(uc.unread, 0)
  FROM
    recent_messages rm
  JOIN
    users u ON rm.other_user_id = u.user_id
  LEFT JOIN
    unread_counts uc ON rm.order_id = uc.order_id
  ORDER BY
    rm.sent_at DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_conversations TO authenticated;

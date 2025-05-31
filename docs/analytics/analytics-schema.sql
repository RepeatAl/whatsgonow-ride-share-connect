
-- Analytics Events Table for comprehensive event tracking
-- DSGVO-compliant with optional user_id and session-based tracking

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  
  -- Core identifiers
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  
  -- Context data
  region TEXT,
  language TEXT NOT NULL DEFAULT 'de',
  page_path TEXT,
  
  -- Video-specific fields
  video_id TEXT,
  video_title TEXT,
  
  -- Language/Region change fields
  from_language TEXT,
  to_language TEXT,
  from_region TEXT,
  to_region TEXT,
  
  -- Flexible metadata as JSONB
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_video_id ON analytics_events(video_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_region_language ON analytics_events(region, language);

-- RLS Policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow inserts for authenticated and anonymous users (for tracking)
CREATE POLICY "Allow analytics insert" ON analytics_events
  FOR INSERT 
  WITH CHECK (true);

-- Only admins can read analytics data
CREATE POLICY "Admin read analytics" ON analytics_events
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Users can only read their own analytics data
CREATE POLICY "Users read own analytics" ON analytics_events
  FOR SELECT 
  USING (user_id = auth.uid());

-- GDPR compliance: Auto-delete analytics data after 2 years
-- This can be implemented as a scheduled function
COMMENT ON TABLE analytics_events IS 'Analytics events with 2-year retention for GDPR compliance';

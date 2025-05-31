
export interface VideoAnalyticsEvent {
  event_type: 'video_started' | 'video_paused' | 'video_completed' | 'video_error' | 'video_thumbnail_clicked' | 'video_seek' | 'video_quality_changed';
  video_id: string;
  video_title?: string;
  user_id?: string;
  session_id: string;
  region?: string;
  language: string;
  timestamp: string;
  metadata?: {
    duration?: number;
    current_time?: number;
    error_code?: string;
    error_message?: string;
    video_url?: string;
    completion_percentage?: number;
    quality?: string;
    watch_duration?: number;
    from_time?: number;
  };
}

export interface LanguageAnalyticsEvent {
  event_type: 'language_switched' | 'region_changed';
  user_id?: string;
  session_id: string;
  from_language?: string;
  to_language: string;
  from_region?: string;
  to_region?: string;
  timestamp: string;
}

export interface UserJourneyEvent {
  event_type: 'page_view' | 'feature_used' | 'conversion_step';
  page_path: string;
  user_id?: string;
  session_id: string;
  region?: string;
  language: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type AnalyticsEvent = VideoAnalyticsEvent | LanguageAnalyticsEvent | UserJourneyEvent;


import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';
import type { AnalyticsEvent, VideoAnalyticsEvent, LanguageAnalyticsEvent, UserJourneyEvent } from '@/types/analytics';

const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const useAnalyticsTracking = () => {
  const [isTracking, setIsTracking] = useState(false);

  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      setIsTracking(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      const sessionId = getOrCreateSessionId();
      
      // Enrich event with session data
      const enrichedEvent = {
        ...event,
        session_id: sessionId,
        user_id: session?.user?.id || null,
        timestamp: new Date().toISOString()
      };

      // Store in Supabase analytics table
      const { error } = await supabase
        .from('analytics_events')
        .insert(enrichedEvent);

      if (error) {
        console.warn('Analytics tracking failed:', error);
      } else {
        console.log('✅ Analytics event tracked:', event.event_type, enrichedEvent);
      }
      
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    } finally {
      setIsTracking(false);
    }
  }, []);

  // Convenience methods for specific event types
  const trackVideoEvent = useCallback((
    eventType: VideoAnalyticsEvent['event_type'],
    videoId: string,
    metadata?: VideoAnalyticsEvent['metadata']
  ) => {
    const currentLanguage = localStorage.getItem('language') || 'de';
    const currentRegion = localStorage.getItem('selected_region') || 'unknown';
    
    trackEvent({
      event_type: eventType,
      video_id: videoId,
      language: currentLanguage,
      region: currentRegion,
      metadata,
      session_id: getOrCreateSessionId(),
      timestamp: new Date().toISOString()
    } as VideoAnalyticsEvent);
  }, [trackEvent]);

  const trackLanguageEvent = useCallback((
    eventType: LanguageAnalyticsEvent['event_type'],
    fromValue?: string,
    toValue?: string
  ) => {
    trackEvent({
      event_type: eventType,
      from_language: eventType === 'language_switched' ? fromValue : undefined,
      to_language: eventType === 'language_switched' ? toValue || 'de' : 'de',
      from_region: eventType === 'region_changed' ? fromValue : undefined,
      to_region: eventType === 'region_changed' ? toValue : undefined,
      session_id: getOrCreateSessionId(),
      timestamp: new Date().toISOString()
    } as LanguageAnalyticsEvent);
  }, [trackEvent]);

  const trackPageView = useCallback((pagePath: string, metadata?: Record<string, any>) => {
    const currentLanguage = localStorage.getItem('language') || 'de';
    const currentRegion = localStorage.getItem('selected_region') || 'unknown';
    
    trackEvent({
      event_type: 'page_view',
      page_path: pagePath,
      language: currentLanguage,
      region: currentRegion,
      metadata,
      session_id: getOrCreateSessionId(),
      timestamp: new Date().toISOString()
    } as UserJourneyEvent);
  }, [trackEvent]);

  return {
    trackEvent,
    trackVideoEvent,
    trackLanguageEvent,
    trackPageView,
    isTracking
  };
};

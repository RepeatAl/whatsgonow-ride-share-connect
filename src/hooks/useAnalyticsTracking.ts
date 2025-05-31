import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';
import { 
  AnalyticsEvent, 
  VideoAnalyticsEvent, 
  LanguageAnalyticsEvent, 
  UserJourneyEvent,
  AnalyticsValidator
} from '@/types/analytics';
import AnalyticsErrorLogger from '@/utils/analytics-error-logger';

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

  const trackEvent = useCallback(async (event: unknown) => {
    try {
      setIsTracking(true);
      const sessionId = getOrCreateSessionId();
      
      // Validate event using Zod schema
      const validationResult = AnalyticsValidator.validateEvent(event);
      
      if (!validationResult.success) {
        // Log validation failure with new error logger
        AnalyticsErrorLogger.logValidationError(
          event,
          validationResult.errors || ['Unknown validation error'],
          sessionId
        );
        
        return; // Don't save invalid events
      }

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Enrich validated event with session data
      const enrichedEvent = {
        ...validationResult.data,
        session_id: sessionId,
        user_id: session?.user?.id || null,
        timestamp: new Date().toISOString()
      };

      // Store in Supabase analytics table
      const { error } = await supabase
        .from('analytics_events')
        .insert(enrichedEvent);

      if (error) {
        // Log database failure with new error logger
        AnalyticsErrorLogger.logDatabaseError(
          enrichedEvent,
          error.message,
          sessionId
        );
      } else {
        console.log('✅ Analytics event tracked successfully:', validationResult.data?.event_type, enrichedEvent);
      }
      
    } catch (error) {
      const sessionId = getOrCreateSessionId();
      
      // Log system errors with new error logger
      AnalyticsErrorLogger.logSystemError(
        event,
        error instanceof Error ? error.message : 'Unknown error',
        sessionId
      );
    } finally {
      setIsTracking(false);
    }
  }, []);

  // Convenience methods for specific event types with validation
  const trackVideoEvent = useCallback((
    eventType: VideoAnalyticsEvent['event_type'],
    videoId: string,
    metadata?: VideoAnalyticsEvent['metadata']
  ) => {
    const currentLanguage = localStorage.getItem('language') || 'de';
    const currentRegion = localStorage.getItem('selected_region') || 'unknown';
    
    const event = {
      event_type: eventType,
      video_id: videoId,
      language: currentLanguage,
      region: currentRegion,
      metadata,
      session_id: getOrCreateSessionId(),
      timestamp: new Date().toISOString()
    };

    trackEvent(event);
  }, [trackEvent]);

  const trackLanguageEvent = useCallback((
    eventType: LanguageAnalyticsEvent['event_type'],
    fromValue?: string,
    toValue?: string
  ) => {
    const event = {
      event_type: eventType,
      from_language: eventType === 'language_switched' ? fromValue : undefined,
      to_language: eventType === 'language_switched' ? toValue || 'de' : 'de',
      from_region: eventType === 'region_changed' ? fromValue : undefined,
      to_region: eventType === 'region_changed' ? toValue : undefined,
      session_id: getOrCreateSessionId(),
      timestamp: new Date().toISOString(),
      language: localStorage.getItem('language') || 'de',
    };

    trackEvent(event);
  }, [trackEvent]);

  const trackPageView = useCallback((pagePath: string, metadata?: Record<string, any>) => {
    const currentLanguage = localStorage.getItem('language') || 'de';
    const currentRegion = localStorage.getItem('selected_region') || 'unknown';
    
    const event = {
      event_type: 'page_view' as const,
      page_path: pagePath,
      language: currentLanguage,
      region: currentRegion,
      metadata,
      session_id: getOrCreateSessionId(),
      timestamp: new Date().toISOString()
    };

    trackEvent(event);
  }, [trackEvent]);

  return {
    trackEvent,
    trackVideoEvent,
    trackLanguageEvent,
    trackPageView,
    isTracking
  };
};

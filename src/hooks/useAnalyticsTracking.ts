
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
import { useAnalyticsFeatureFlags } from './useFeatureFlags';

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
  const featureFlags = useAnalyticsFeatureFlags();

  const trackEvent = useCallback(async (event: unknown) => {
    // Feature Gate: Check if analytics events v2 is enabled
    if (!featureFlags.eventsV2) {
      console.log('Analytics Events V2 disabled, skipping event:', event);
      return;
    }

    try {
      setIsTracking(true);
      const sessionId = getOrCreateSessionId();
      
      // Validate event using Zod schema
      const validationResult = AnalyticsValidator.validateEvent(event);
      
      if (!validationResult.success) {
        // Only log validation errors if error monitoring is enabled
        if (featureFlags.errorMonitoring) {
          AnalyticsErrorLogger.logValidationError(
            event,
            validationResult.errors || ['Unknown validation error'],
            sessionId
          );
        }
        
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
        // Only log database errors if error monitoring is enabled
        if (featureFlags.errorMonitoring) {
          AnalyticsErrorLogger.logDatabaseError(
            enrichedEvent,
            error.message,
            sessionId
          );
        }
      } else {
        console.log('✅ Analytics event tracked successfully:', validationResult.data?.event_type, enrichedEvent);
      }
      
    } catch (error) {
      const sessionId = getOrCreateSessionId();
      
      // Only log system errors if error monitoring is enabled
      if (featureFlags.errorMonitoring) {
        AnalyticsErrorLogger.logSystemError(
          event,
          error instanceof Error ? error.message : 'Unknown error',
          sessionId
        );
      }
    } finally {
      setIsTracking(false);
    }
  }, [featureFlags.eventsV2, featureFlags.errorMonitoring]);

  // Convenience methods for specific event types with feature gates
  const trackVideoEvent = useCallback((
    eventType: VideoAnalyticsEvent['event_type'],
    videoId: string,
    metadata?: VideoAnalyticsEvent['metadata']
  ) => {
    // Feature Gate: Check if video tracking is enabled
    if (!featureFlags.videoTracking) {
      console.log('Video analytics tracking disabled, skipping event:', eventType);
      return;
    }

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
  }, [trackEvent, featureFlags.videoTracking]);

  const trackLanguageEvent = useCallback((
    eventType: LanguageAnalyticsEvent['event_type'],
    fromValue?: string,
    toValue?: string
  ) => {
    // Feature Gate: Check if language tracking is enabled
    if (!featureFlags.languageTracking) {
      console.log('Language analytics tracking disabled, skipping event:', eventType);
      return;
    }

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
  }, [trackEvent, featureFlags.languageTracking]);

  const trackPageView = useCallback((pagePath: string, metadata?: Record<string, any>) => {
    // Feature Gate: Page view tracking is part of events v2
    if (!featureFlags.eventsV2) {
      console.log('Analytics Events V2 disabled, skipping page view:', pagePath);
      return;
    }

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
  }, [trackEvent, featureFlags.eventsV2]);

  return {
    trackEvent,
    trackVideoEvent,
    trackLanguageEvent,
    trackPageView,
    isTracking,
    
    // Feature flag status for debugging
    featureFlags,
  };
};


import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import type { AnalyticsEvent } from '@/types/analytics';

class AnalyticsService {
  private static getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  static async trackEvent(event: Partial<AnalyticsEvent>): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const sessionId = this.getOrCreateSessionId();
      const currentLanguage = localStorage.getItem('language') || 'de';
      const currentRegion = localStorage.getItem('selected_region') || 'unknown';

      const enrichedEvent = {
        session_id: sessionId,
        user_id: session?.user?.id || null,
        language: currentLanguage,
        region: currentRegion,
        timestamp: new Date().toISOString(),
        metadata: {},
        ...event
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(enrichedEvent);

      if (error) {
        console.error('❌ Analytics event failed:', error);
        return false;
      }

      console.log('✅ Analytics event tracked:', event.event_type);
      return true;
    } catch (error) {
      console.error('❌ Analytics service error:', error);
      return false;
    }
  }

  static async trackPageView(pagePath: string, metadata?: Record<string, any>): Promise<boolean> {
    return this.trackEvent({
      event_type: 'page_view',
      page_path: pagePath,
      metadata: {
        referrer: document.referrer || null,
        user_agent: navigator.userAgent || null,
        ...metadata
      }
    });
  }

  static async trackVideoEvent(
    eventType: string, 
    videoId: string, 
    metadata?: Record<string, any>
  ): Promise<boolean> {
    return this.trackEvent({
      event_type: eventType,
      video_id: videoId,
      metadata
    });
  }

  static async trackLanguageChange(fromLanguage: string, toLanguage: string): Promise<boolean> {
    return this.trackEvent({
      event_type: 'language_switched',
      from_language: fromLanguage,
      to_language: toLanguage,
      metadata: {
        switched_at: new Date().toISOString()
      }
    });
  }

  static async trackRegionChange(fromRegion: string, toRegion: string): Promise<boolean> {
    return this.trackEvent({
      event_type: 'region_changed',
      from_region: fromRegion,
      to_region: toRegion,
      metadata: {
        changed_at: new Date().toISOString()
      }
    });
  }
}

export default AnalyticsService;

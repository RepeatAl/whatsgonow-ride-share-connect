
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const getOrCreateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

class AnalyticsErrorLogger {
  static async logValidationError(
    event: unknown,
    errors: string[],
    sessionId: string
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const errorEvent = {
        event_type: 'analytics_validation_error',
        user_id: session?.user?.id || null,
        session_id: sessionId,
        language: localStorage.getItem('language') || 'de',
        region: localStorage.getItem('selected_region') || 'unknown',
        metadata: {
          original_event: event,
          validation_errors: errors,
          error_type: 'validation',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(errorEvent);

      if (error) {
        console.error('❌ Failed to log validation error:', error);
      } else {
        console.log('✅ Validation error logged to analytics_events');
      }
    } catch (error) {
      console.error('❌ Analytics validation error logging failed:', error);
    }
  }

  static async logDatabaseError(
    event: unknown,
    errorMessage: string,
    sessionId: string
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const errorEvent = {
        event_type: 'analytics_database_error',
        user_id: session?.user?.id || null,
        session_id: sessionId,
        language: localStorage.getItem('language') || 'de',
        region: localStorage.getItem('selected_region') || 'unknown',
        metadata: {
          original_event: event,
          error_message: errorMessage,
          error_type: 'database',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      // Try logging to console as fallback since DB insert failed
      console.error('💾 Analytics Database Error');
      console.error('Event:', event);
      console.error('Error:', errorMessage);

      // Still try to insert error event (might work if it was a temporary issue)
      const { error } = await supabase
        .from('analytics_events')
        .insert(errorEvent);

      if (!error) {
        console.log('✅ Database error logged to analytics_events');
      }
    } catch (error) {
      console.error('❌ Analytics database error logging failed:', error);
    }
  }

  static async logSystemError(
    event: unknown,
    errorMessage: string,
    sessionId: string
  ): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const errorEvent = {
        event_type: 'analytics_system_error',
        user_id: session?.user?.id || null,
        session_id: sessionId,
        language: localStorage.getItem('language') || 'de',
        region: localStorage.getItem('selected_region') || 'unknown',
        metadata: {
          original_event: event,
          error_message: errorMessage,
          error_type: 'system',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      console.error('🔥 Analytics System Error');
      console.error('Event:', event);
      console.error('Error:', errorMessage);

      const { error } = await supabase
        .from('analytics_events')
        .insert(errorEvent);

      if (!error) {
        console.log('✅ System error logged to analytics_events');
      }
    } catch (error) {
      console.error('❌ Analytics system error logging failed:', error);
    }
  }
}

export default AnalyticsErrorLogger;


import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';

const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const sessionId = getOrCreateSessionId();
        const currentLanguage = localStorage.getItem('language') || 'de';
        const currentRegion = localStorage.getItem('selected_region') || 'unknown';

        const { error: insertError } = await supabase
          .from('analytics_events')
          .insert({
            event_type: 'page_view',
            page_path: location.pathname,
            user_id: session?.user?.id ?? null,
            session_id: sessionId,
            language: currentLanguage,
            region: currentRegion,
            timestamp: new Date().toISOString(),
            metadata: {
              referrer: document.referrer || null,
              user_agent: navigator.userAgent || null
            }
          });

        if (insertError) throw insertError;
        console.log('✅ Page view tracked:', location.pathname);
      } catch (error) {
        console.error("Analytics tracking failed:", error);
      } finally {
        setLoading(false);
      }
    };

    trackPageView();
  }, [location.pathname]);

  return { loading };
};

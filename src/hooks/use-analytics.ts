import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('analytics_session_id', sessionId);
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

        const { error: insertError } = await supabase
          .from('analytics')
          .insert({
            page: location.pathname,
            user_id: session?.user?.id ?? null,
            session_id: sessionId,
            timestamp: new Date().toISOString()
          });

        if (insertError) throw insertError;
      } catch (error) {
        // Optionale Fehlerausgabe für Analytics (kann auch entfernt werden)
        console.error("Analytics tracking failed:", error);
      } finally {
        setLoading(false);
      }
    };

    trackPageView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Wichtig: nur auf Pfadwechsel tracken

  return { loading };
};

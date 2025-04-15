
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
      const { data: { session } } = await supabase.auth.getSession();
      const sessionId = getOrCreateSessionId();

      await supabase.from('analytics').insert({
        page: location.pathname,
        user_id: session?.user?.id,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      });

      setLoading(false);
    };

    trackPageView();
  }, [location.pathname]);

  return { loading };
};

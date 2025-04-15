
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PageView {
  page: string;
  timestamp: string;
  user_id?: string;
  session_id: string;
}

export const useAnalytics = (page: string) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackPageView = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const sessionId = session?.access_token.slice(-12) || 'anonymous';

      await supabase.from('analytics').insert({
        page,
        user_id: session?.user?.id,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      });

      setLoading(false);
    };

    trackPageView();
  }, [page]);

  return { loading };
};

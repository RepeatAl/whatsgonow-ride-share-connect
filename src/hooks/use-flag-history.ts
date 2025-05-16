
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface FlagHistoryEntry {
  id: string;
  user_id: string;
  flagged: boolean;
  reason: string | null;
  actor_id: string;
  role: string;
  created_at: string;
  actor_name?: string; // Name of the CM/Admin from profiles
}

export function useFlagHistory(userId: string) {
  const [history, setHistory] = useState<FlagHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFlagHistory() {
      try {
        setLoading(true);
        
        // Fetch flag history for user
        const { data: flagHistoryData, error: flagHistoryError } = await supabase
          .from('user_flag_audit')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (flagHistoryError) throw flagHistoryError;
        
        // Get actor names from profiles
        const actorIds = flagHistoryData.map(entry => entry.actor_id);
        
        const { data: actorsData, error: actorsError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', actorIds);
          
        if (actorsError) throw actorsError;
        
        // Create a map of actor IDs to names
        const actorNameMap: Record<string, string> = {};
        actorsData?.forEach(actor => {
          actorNameMap[actor.user_id] = `${actor.first_name} ${actor.last_name}`;
        });
        
        // Combine data
        const historyWithNames = flagHistoryData.map(entry => ({
          ...entry,
          actor_name: actorNameMap[entry.actor_id] || 'Unbekannt'
        }));
        
        setHistory(historyWithNames);
      } catch (err) {
        console.error('Error fetching flag history:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchFlagHistory();
    }
  }, [userId]);
  
  // Useful calculated properties for UI components
  const hasRecentFlag = history.length > 0 && history[0].flagged;
  const isTrendingDown = history.length >= 3 && 
    history.filter(entry => entry.flagged).length >= 2;
  
  return { 
    history, 
    loading, 
    error,
    hasRecentFlag,
    isTrendingDown
  };
}


import { useState, useEffect } from 'react';
import { trustService, TrustScoreAuditEntry } from '@/services/trustService';

export function useTrustScoreHistory(userId?: string, limit = 10) {
  const [history, setHistory] = useState<TrustScoreAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchTrustScoreHistory() {
      try {
        setLoading(true);
        setError(null);
        
        const historyData = await trustService.getTrustScoreHistory(userId, limit);
        setHistory(historyData);
      } catch (err) {
        console.error('Error fetching trust score history:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrustScoreHistory();
  }, [userId, limit]);

  return {
    history,
    loading,
    error
  };
}

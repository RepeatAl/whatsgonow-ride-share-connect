
import { useState, useEffect } from 'react';
import { trustService, TrustScoreAuditEntry } from '@/services/trustService';

export function useTrustScoreHistory(userId?: string, limit = 10) {
  const [history, setHistory] = useState<TrustScoreAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isTrendingDown, setIsTrendingDown] = useState(false);
  const [hasRecentDrop, setHasRecentDrop] = useState(false);
  const [recentDropAmount, setRecentDropAmount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    async function fetchTrustScoreHistory() {
      try {
        setLoading(true);
        setError(null);
        
        const historyData = await trustService.getTrustScoreHistory(userId, limit);
        setHistory(historyData);
        
        // Calculate trend indicators
        if (historyData.length >= 3) {
          // Check if scores are consistently declining
          const isDecreasing = historyData
            .slice(0, Math.min(5, historyData.length))
            .every((entry, i, arr) => i === 0 || entry.new_score <= arr[i - 1].new_score);
          
          setIsTrendingDown(isDecreasing);
          
          // Check for recent significant drop (last 7 days)
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          const recentEntries = historyData.filter(
            entry => new Date(entry.created_at) >= oneWeekAgo
          );
          
          if (recentEntries.length > 0) {
            const totalDrop = recentEntries.reduce((sum, entry) => sum + entry.delta, 0);
            setHasRecentDrop(totalDrop < -20);
            setRecentDropAmount(totalDrop);
          }
        }
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
    error,
    isTrendingDown,
    hasRecentDrop,
    recentDropAmount
  };
}

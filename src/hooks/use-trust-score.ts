
import { useState, useEffect } from 'react';
import { trustService } from '@/services/trustService';

export function useTrustScore(userId?: string) {
  const [score, setScore] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchTrustScore() {
      try {
        setLoading(true);
        setError(null);
        
        const result = await trustService.getUserTrustScore(userId);
        
        setScore(result.score);
        setLastUpdated(result.lastUpdated);
        setIsVerified(result.isVerified);
      } catch (err) {
        console.error('Error fetching trust score:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrustScore();
  }, [userId]);

  return {
    score,
    lastUpdated,
    isVerified,
    loading,
    error
  };
}

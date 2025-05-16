
import { supabase } from '@/lib/supabaseClient';

/**
 * Service for managing user trust scores
 */
export const trustService = {
  /**
   * Get the current trust score for a user
   * 
   * @param userId The user ID to get the trust score for
   * @returns The trust score (0-200) or null if not available
   */
  getUserTrustScore: async (userId: string): Promise<{ 
    score: number | null, 
    lastUpdated: Date | null,
    isVerified: boolean
  }> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('trust_score, trust_score_updated_at, id_verified, vehicle_verified')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        score: data?.trust_score ?? null,
        lastUpdated: data?.trust_score_updated_at ? new Date(data.trust_score_updated_at) : null,
        isVerified: data?.id_verified === true || data?.vehicle_verified === true
      };
    } catch (error) {
      console.error('Error fetching trust score:', error);
      return {
        score: null,
        lastUpdated: null,
        isVerified: false
      };
    }
  },
  
  /**
   * Get the trust score history for a user
   * 
   * @param userId The user ID to get the trust score history for
   * @param limit The maximum number of history entries to return (default: 10)
   * @returns Array of trust score audit entries
   */
  getTrustScoreHistory: async (userId: string, limit = 10): Promise<TrustScoreAuditEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('trust_score_audit')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching trust score history:', error);
      return [];
    }
  },
  
  /**
   * Recalculate trust scores for all users (admin only)
   * 
   * @returns The number of user scores updated
   */
  recalculateAllScores: async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .rpc('admin_recalculate_all_trust_scores');
        
      if (error) throw error;
      
      return data || 0;
    } catch (error) {
      console.error('Error recalculating trust scores:', error);
      return 0;
    }
  }
};

/**
 * Trust score audit entry from the database
 */
export interface TrustScoreAuditEntry {
  id: string;
  user_id: string;
  old_score: number | null;
  new_score: number | null;
  delta: number;
  reason: string;
  created_at: string;
}


import { supabase } from '@/lib/supabaseClient';

/**
 * Service for managing trust scores from the admin perspective
 */
export const adminTrustService = {
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
  },

  /**
   * Get all trust score audit entries for admin review
   * 
   * @param limit Maximum number of entries to return (default: 50)
   * @returns Array of trust score audit entries
   */
  getAllTrustScoreAudits: async (limit = 50): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('trust_score_audit')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching trust score audits:', error);
      return [];
    }
  }
};

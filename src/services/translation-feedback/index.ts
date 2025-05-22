
import { supabase } from '@/lib/supabaseClient';
import { TranslationFeedback, TranslationFeedbackFilter, ReviewFeedbackParams } from './types';

/**
 * Service für die Verwaltung von Übersetzungsfeedback
 */
export const translationFeedbackService = {
  /**
   * Feedback einreichen
   */
  async submitFeedback(feedback: TranslationFeedback): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      const { data, error } = await supabase
        .from('translation_feedback')
        .insert([feedback])
        .select('id')
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Error submitting translation feedback:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Feedback eines Nutzers abrufen
   */
  async getUserFeedback(): Promise<TranslationFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('translation_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      return [];
    }
  },

  /**
   * Alle Feedbacks abrufen (für Admins)
   */
  async getAllFeedback(filters: TranslationFeedbackFilter = {}): Promise<TranslationFeedback[]> {
    try {
      let query = supabase
        .from('translation_feedback')
        .select('*, profiles:reviewed_by(first_name, last_name)')
        .order('created_at', { ascending: false });

      // Filter anwenden
      if (filters.language) {
        query = query.eq('language', filters.language);
      }
      if (filters.namespace) {
        query = query.eq('namespace', filters.namespace);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      return [];
    }
  },

  /**
   * Feedback als Admin überprüfen
   */
  async reviewFeedback({ id, status, notes }: ReviewFeedbackParams): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('translation_feedback')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: supabase.auth.getUser().then(res => res.data.user?.id),
          metadata: { admin_notes: notes }
        })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error reviewing feedback:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Einzelnes Feedback abrufen
   */
  async getFeedbackById(id: string): Promise<TranslationFeedback | null> {
    try {
      const { data, error } = await supabase
        .from('translation_feedback')
        .select('*, profiles:reviewed_by(first_name, last_name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching feedback with ID ${id}:`, error);
      return null;
    }
  }
};

export * from './types';

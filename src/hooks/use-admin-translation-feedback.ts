
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  translationFeedbackService,
  TranslationFeedback,
  TranslationFeedbackFilter,
  ReviewFeedbackParams
} from '@/services/translation-feedback';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export function useAdminTranslationFeedback() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const { t } = useTranslation();
  
  // Alle Feedbacks für Admins laden
  const loadAllFeedback = async (filters: TranslationFeedbackFilter = {}) => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      toast({
        title: t('admin.error.unauthorized'),
        description: t('admin.error.admin_required'),
        variant: 'destructive'
      });
      return [];
    }
    
    setLoading(true);
    try {
      const feedbackList = await translationFeedbackService.getAllFeedback(filters);
      return feedbackList;
    } catch (error) {
      console.error('Error loading feedback for admin:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Feedback überprüfen und Status ändern
  const reviewFeedback = async (params: ReviewFeedbackParams): Promise<boolean> => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      toast({
        title: t('admin.error.unauthorized'),
        description: t('admin.error.admin_required'),
        variant: 'destructive'
      });
      return false;
    }

    setReviewing(true);
    try {
      const { success, error } = await translationFeedbackService.reviewFeedback(params);
      
      if (success) {
        toast({
          title: t('admin.feedback.review_success'),
          description: t('admin.feedback.status_updated'),
          variant: 'success'
        });
        return true;
      } else {
        throw new Error(error);
      }
    } catch (error) {
      toast({
        title: t('admin.feedback.review_failed'),
        description: error instanceof Error ? error.message : t('admin.error.unknown'),
        variant: 'destructive'
      });
      return false;
    } finally {
      setReviewing(false);
    }
  };

  // Einzelnes Feedback laden
  const loadFeedbackById = async (id: string): Promise<TranslationFeedback | null> => {
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return null;
    }
    
    try {
      return await translationFeedbackService.getFeedbackById(id);
    } catch (error) {
      console.error(`Error loading feedback ${id}:`, error);
      return null;
    }
  };

  return {
    loadAllFeedback,
    reviewFeedback,
    loadFeedbackById,
    loading,
    reviewing
  };
}

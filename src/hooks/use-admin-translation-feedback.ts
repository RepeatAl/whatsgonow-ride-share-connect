
import { useState } from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { 
  translationFeedbackService,
  TranslationFeedback,
  TranslationFeedbackFilter,
  ReviewFeedbackParams
} from '@/services/translation-feedback';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export function useAdminTranslationFeedback() {
  const { user } = useOptimizedAuth();
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const { t } = useTranslation();

  // Helper zur Rollenprüfung
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');

  // Feedback-Liste für Admins laden
  const loadAllFeedback = async (filters: TranslationFeedbackFilter = {}): Promise<TranslationFeedback[]> => {
    if (!isAdmin) {
      toast({
        title: t('admin.error.unauthorized'),
        description: t('admin.error.admin_required'),
        variant: 'destructive'
      });
      return [];
    }
    setLoading(true);
    try {
      return await translationFeedbackService.getAllFeedback(filters);
    } catch (error) {
      console.error('Error loading feedback for admin:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Feedback reviewen und Status aktualisieren
  const reviewFeedback = async (params: ReviewFeedbackParams): Promise<boolean> => {
    if (!isAdmin) {
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
          variant: 'default'
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

  // Einzelnes Feedback nach ID laden
  const loadFeedbackById = async (id: string): Promise<TranslationFeedback | null> => {
    if (!isAdmin) {
      toast({
        title: t('admin.error.unauthorized'),
        description: t('admin.error.admin_required'),
        variant: 'destructive'
      });
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

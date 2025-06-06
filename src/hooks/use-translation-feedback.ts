import { useState } from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { translationFeedbackService, TranslationFeedback } from '@/services/translation-feedback';
import { useLanguage } from '@/contexts/language';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export function useTranslationFeedback() {
  const { user } = useOptimizedAuth();
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useTranslation();
  
  // Feedback absenden
  const submitFeedback = async (feedback: Omit<TranslationFeedback, 'user_id' | 'created_at' | 'language'>): Promise<boolean> => {
    if (!user && !feedback.email) {
      toast({
        title: t('feedback.error.missing_email'),
        description: t('feedback.error.provide_email_or_login'),
        variant: 'destructive'
      });
      return false;
    }

    setSubmitting(true);
    try {
      // Automatisch aktuelle Sprache und User-ID hinzufügen
      const completeData: TranslationFeedback = {
        ...feedback,
        language: currentLanguage,
        user_id: user?.id,
        page_url: window.location.href
      };

      const { success, error } = await translationFeedbackService.submitFeedback(completeData);
      
      if (success) {
        toast({
          title: t('feedback.success.title'),
          description: t('feedback.success.description'),
          variant: 'default'
        });
        return true;
      } else {
        throw new Error(error);
      }
    } catch (error) {
      toast({
        title: t('feedback.error.submission_failed'),
        description: error instanceof Error ? error.message : t('feedback.error.unknown'),
        variant: 'destructive'
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Feedback laden
  const loadUserFeedback = async () => {
    if (!user) return [];
    
    setLoading(true);
    try {
      const feedbackList = await translationFeedbackService.getUserFeedback();
      return feedbackList;
    } catch (error) {
      console.error('Error loading user feedback:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    submitFeedback,
    loadUserFeedback,
    loading,
    submitting
  };
}

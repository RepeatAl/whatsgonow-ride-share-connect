
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export type FeedbackData = {
  feedbackType: 'suggestion' | 'bug' | 'compliment' | 'question';
  title?: string;
  content: string;
  satisfaction: string;
  features: string[];
  email?: string;
};

export type UseFeedbackResult = {
  submitFeedback: (data: FeedbackData) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
};

export function useFeedback(): UseFeedbackResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  const submitFeedback = async (data: FeedbackData): Promise<boolean> => {
    if (!user) {
      toast.error(t("feedback.toast.auth_error"));
      return false;
    }

    if (!data.content.trim()) {
      toast.error(t("feedback.toast.content_required"));
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Insert feedback into the database
      const { data: feedbackData, error: supabaseError } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          feedback_type: data.feedbackType,
          title: data.title || t("feedback.form.default_title"),
          content: data.content,
          satisfaction_rating: parseInt(data.satisfaction),
          features: data.features,
          email: data.email || user.email,
          status: 'open'
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('Error submitting feedback:', supabaseError);
        setError(supabaseError);
        toast.error(t("feedback.toast.error"));
        return false;
      }

      // Send email notification to admin
      try {
        await supabase.functions.invoke('send-feedback-notification', {
          body: {
            feedbackId: feedbackData.id,
            title: feedbackData.title,
            content: feedbackData.content,
            feedbackType: feedbackData.feedback_type,
            satisfactionRating: feedbackData.satisfaction_rating,
            email: feedbackData.email
          }
        });
      } catch (emailError) {
        // Log error but don't fail the feedback submission
        console.error('Error sending feedback notification email:', emailError);
      }

      toast.success(t("feedback.toast.success"));
      return true;
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(err);
      toast.error(t("feedback.toast.error"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitFeedback,
    loading,
    error
  };
}

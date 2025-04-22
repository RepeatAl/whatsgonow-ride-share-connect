
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type FeedbackData = {
  feedbackType: 'suggestion' | 'bug' | 'compliment' | 'question';
  title?: string;
  content: string;
  satisfaction?: string;
  features?: string[];
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

  const submitFeedback = async (data: FeedbackData): Promise<boolean> => {
    if (!data.content.trim()) {
      toast.error("Bitte geben Sie eine Nachricht ein");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: notificationError } = await supabase.functions.invoke('send-feedback-notification', {
        body: {
          title: data.title || 'Neue Support-Anfrage',
          feedbackType: data.feedbackType,
          message: data.content,
          email: data.email
        }
      });

      if (notificationError) {
        throw notificationError;
      }

      toast.success("Ihre Anfrage wurde erfolgreich gesendet");
      return true;
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(err);
      toast.error("Fehler beim Senden Ihrer Anfrage. Bitte versuchen Sie es später erneut.");
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

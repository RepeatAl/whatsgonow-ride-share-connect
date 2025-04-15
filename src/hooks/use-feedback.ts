
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

  const submitFeedback = async (data: FeedbackData): Promise<boolean> => {
    if (!user) {
      toast.error("Bitte melden Sie sich an, um Feedback zu senden.");
      return false;
    }

    if (!data.content.trim()) {
      toast.error("Bitte geben Sie Ihr Feedback ein.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          feedback_type: data.feedbackType,
          title: data.title || 'Allgemeines Feedback',
          content: data.content,
          satisfaction_rating: parseInt(data.satisfaction),
          features: data.features,
          email: data.email || user.email,
          status: 'open' // Explizit den Anfangsstatus setzen
        });

      if (supabaseError) {
        console.error('Error submitting feedback:', supabaseError);
        setError(supabaseError);
        toast.error("Feedback konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
        return false;
      }

      toast.success("Vielen Dank für Ihr Feedback! Wir werden es sorgfältig prüfen.");
      return true;
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(err);
      toast.error(err.message || "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
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

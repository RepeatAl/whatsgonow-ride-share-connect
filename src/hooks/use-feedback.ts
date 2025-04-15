
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

export function useFeedback() {
  const [loading, setLoading] = useState(false);
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
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          feedback_type: data.feedbackType,
          title: data.title || 'Allgemeines Feedback',
          content: data.content,
          satisfaction_rating: parseInt(data.satisfaction),
          features: data.features,
          email: data.email || user.email
        });

      if (error) {
        console.error('Error submitting feedback:', error);
        throw error;
      }

      toast.success("Vielen Dank für Ihr Feedback!");
      return true;
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast.error(error.message || "Feedback konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitFeedback,
    loading
  };
}

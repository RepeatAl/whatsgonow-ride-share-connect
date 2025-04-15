
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type FeedbackData = {
  feedbackType: 'suggestion' | 'bug' | 'compliment' | 'question';
  title: string;
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
      toast({
        title: "Nicht angemeldet",
        description: "Bitte melden Sie sich an, um Feedback zu senden.",
        variant: "destructive"
      });
      return false;
    }

    if (!data.content.trim()) {
      toast({
        title: "Feedback fehlt",
        description: "Bitte geben Sie Ihr Feedback ein.",
        variant: "destructive"
      });
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

      toast({
        title: "Feedback gesendet",
        description: "Vielen Dank für Ihr Feedback!"
      });

      return true;
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Fehler",
        description: error.message || "Feedback konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
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

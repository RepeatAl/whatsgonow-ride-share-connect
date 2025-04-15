
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type FeedbackItem = {
  id: string;
  title: string;
  content: string;
  feedback_type: string;
  created_at: string;
  status: string;
  email?: string;
  satisfaction_rating?: number;
  responses?: FeedbackResponse[];
};

export type FeedbackResponse = {
  id: string;
  feedback_id: string;
  admin_id: string;
  content: string;
  created_at: string;
};

export function useFeedbackAdmin() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select(`
          *,
          responses:feedback_responses(*)
        `)
        .order('created_at', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback:', feedbackError);
        toast.error("Feedback konnte nicht geladen werden.");
        return;
      }

      setFeedbackItems(feedbackData || []);
      setLoading(false);
    };

    fetchFeedback();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('feedback_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'feedback' },
        () => {
          fetchFeedback();
      })
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'feedback_responses' },
        () => {
          fetchFeedback();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateFeedbackStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('feedback')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error("Status konnte nicht aktualisiert werden.");
      return;
    }

    toast.success("Feedback-Status wurde aktualisiert.");
  };

  const addResponse = async (feedbackId: string, content: string) => {
    const { error } = await supabase
      .from('feedback_responses')
      .insert({
        feedback_id: feedbackId,
        content,
        admin_id: supabase.auth.getUser().then(({ data }) => data.user?.id)
      });

    if (error) {
      toast.error("Antwort konnte nicht gesendet werden.");
      return false;
    }

    toast.success("Antwort wurde gesendet.");
    return true;
  };

  const filteredFeedback = feedbackItems.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  return {
    feedbackItems: filteredFeedback,
    loading,
    filter,
    setFilter,
    updateFeedbackStatus,
    addResponse
  };
}

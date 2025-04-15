
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
};

export function useFeedbackAdmin() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        toast.error("Feedback konnte nicht geladen werden.");
        return;
      }

      setFeedbackItems(data || []);
      setLoading(false);
    };

    fetchFeedback();

    const channel = supabase
      .channel('feedback_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'feedback' },
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

  const filteredFeedback = feedbackItems.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  return {
    feedbackItems: filteredFeedback,
    loading,
    filter,
    setFilter,
    updateFeedbackStatus
  };
}

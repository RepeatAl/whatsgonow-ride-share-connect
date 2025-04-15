
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export type FeedbackTypeCount = {
  type: string;
  count: number;
};

export type FeedbackTrend = {
  date: string;
  count: number;
};

export function useFeedbackAnalytics(timeRange: number = 30) {
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackTypeCount[]>([]);
  const [feedbackTrends, setFeedbackTrends] = useState<FeedbackTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch feedback type distribution
        const { data: typeData, error: typeError } = await supabase
          .from('feedback')
          .select('feedback_type, created_at')
          .gte('created_at', new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString());

        if (typeError) throw typeError;

        // Process feedback types
        const typeCounts = typeData.reduce((acc: { [key: string]: number }, curr) => {
          acc[curr.feedback_type] = (acc[curr.feedback_type] || 0) + 1;
          return acc;
        }, {});

        setFeedbackTypes(
          Object.entries(typeCounts)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
        );

        // Process daily trends
        const dailyCounts = typeData.reduce((acc: { [key: string]: number }, curr) => {
          const date = new Date(curr.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        setFeedbackTrends(
          Object.entries(dailyCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))
        );

        setLoading(false);
      } catch (error: any) {
        toast({
          title: "Fehler beim Laden der Analytics",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, toast]);

  return {
    feedbackTypes,
    feedbackTrends,
    loading
  };
}

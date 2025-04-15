
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type FeedbackTypeCount = {
  type: string;
  count: number;
};

export type FeedbackTrend = {
  date: string;
  count: number;
};

export type TimeRange = '7' | '30' | '90' | '365';

export type FeedbackAnalyticsData = {
  typeDistribution: FeedbackTypeCount[];
  timeTrend: FeedbackTrend[];
  isLoading: boolean;
  error: Error | null;
  exportData: () => void;
};

export function useFeedbackAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const [typeDistribution, setTypeDistribution] = useState<FeedbackTypeCount[]>([]);
  const [timeTrend, setTimeTrend] = useState<FeedbackTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Calculate date range based on selected time period
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));
      
      // Fetch feedback data from Supabase
      const { data, error } = await supabase
        .from('feedback')
        .select('feedback_type, created_at')
        .gte('created_at', startDate.toISOString());
      
      if (error) throw new Error(error.message);
      
      // Process type distribution
      const typeCounts: Record<string, number> = {};
      data.forEach(item => {
        typeCounts[item.feedback_type] = (typeCounts[item.feedback_type] || 0) + 1;
      });
      
      const typeDistributionData = Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count
      }));
      
      // Process time trend
      const dateCounts: Record<string, number> = {};
      
      // Determine grouping format based on time range
      const groupByDay = parseInt(timeRange) <= 30;
      
      data.forEach(item => {
        const date = new Date(item.created_at);
        let dateKey: string;
        
        if (groupByDay) {
          dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else {
          // Group by week - get the Monday of the week
          const dayOfWeek = date.getDay();
          const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          const monday = new Date(date.setDate(diff));
          dateKey = monday.toISOString().split('T')[0];
        }
        
        dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
      });
      
      const timeTrendData = Object.entries(dateCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      setTypeDistribution(typeDistributionData);
      setTimeTrend(timeTrendData);
      
      // Set up realtime subscription
      setUpRealtimeSubscription();
      
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err);
      toast({
        title: "Fehler beim Laden der Daten",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up realtime subscription to feedback table
  const setUpRealtimeSubscription = () => {
    const channel = supabase
      .channel('feedback-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'feedback' }, 
        (payload) => {
          console.log('Realtime update:', payload);
          // Refetch data when changes occur
          fetchAnalyticsData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Export data as CSV
  const exportData = () => {
    try {
      // Combine type and trend data
      const exportTypes = typeDistribution.map(item => ({
        category: 'type',
        type: item.type,
        count: item.count,
        date: null
      }));
      
      const exportTrends = timeTrend.map(item => ({
        category: 'trend',
        type: null,
        count: item.count,
        date: item.date
      }));
      
      const exportData = [...exportTypes, ...exportTrends];
      
      // Convert to CSV
      const headers = ['category', 'type', 'count', 'date'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => {
          return headers.map(header => {
            const value = row[header as keyof typeof row];
            // Handle null values and strings with commas
            return value === null 
              ? '' 
              : typeof value === 'string' && value.includes(',') 
                ? `"${value}"`
                : value;
          }).join(',');
        })
      ].join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `feedback-analytics-${timeRange}-days.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export erfolgreich",
        description: "Die Daten wurden als CSV exportiert.",
      });
    } catch (err: any) {
      console.error('Error exporting data:', err);
      toast({
        title: "Export fehlgeschlagen",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Fetch data when component mounts or time range changes
  useEffect(() => {
    fetchAnalyticsData();
    
    // Clean up subscription when component unmounts
    return () => {
      // Cleanup is handled by setUpRealtimeSubscription's return function
    };
  }, [timeRange]);

  return {
    timeRange,
    setTimeRange,
    typeDistribution,
    timeTrend,
    isLoading,
    error,
    exportData,
    refreshData: fetchAnalyticsData
  };
}

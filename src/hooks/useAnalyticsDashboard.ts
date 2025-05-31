
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AnalyticsSummary {
  totalEvents: number;
  videoViews: number;
  completionRate: number;
  averageWatchTime: number;
  topRegions: Array<{ region: string; count: number }>;
  languageDistribution: Array<{ language: string; count: number }>;
  errorRate: number;
}

interface VideoAnalytics {
  video_id: string;
  views: number;
  completions: number;
  completion_rate: number;
  errors: number;
  average_watch_time: number;
}

export const useAnalyticsDashboard = (dateRange?: { from: Date; to: Date }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [videoAnalytics, setVideoAnalytics] = useState<VideoAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build date filter
        let dateFilter = '';
        if (dateRange) {
          dateFilter = `timestamp.gte.${dateRange.from.toISOString()}.and.timestamp.lte.${dateRange.to.toISOString()}`;
        } else {
          // Default to last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          dateFilter = `timestamp.gte.${thirtyDaysAgo.toISOString()}`;
        }

        // Fetch overall summary
        const { data: events, error: eventsError } = await supabase
          .from('analytics_events')
          .select('*')
          .or(dateFilter);

        if (eventsError) throw eventsError;

        // Process summary data
        const totalEvents = events?.length || 0;
        const videoEvents = events?.filter(e => e.event_type.startsWith('video_')) || [];
        const videoViews = events?.filter(e => e.event_type === 'video_started').length || 0;
        const videoCompletions = events?.filter(e => e.event_type === 'video_completed').length || 0;
        const videoErrors = events?.filter(e => e.event_type === 'video_error').length || 0;

        // Calculate regions and languages
        const regionCounts = events?.reduce((acc: Record<string, number>, event) => {
          if (event.region) {
            acc[event.region] = (acc[event.region] || 0) + 1;
          }
          return acc;
        }, {}) || {};

        const languageCounts = events?.reduce((acc: Record<string, number>, event) => {
          if (event.language) {
            acc[event.language] = (acc[event.language] || 0) + 1;
          }
          return acc;
        }, {}) || {};

        // Calculate average watch time from metadata
        const watchTimes = events
          ?.filter(e => e.event_type === 'video_completed' && e.metadata?.watch_duration)
          .map(e => e.metadata.watch_duration as number) || [];
        
        const averageWatchTime = watchTimes.length > 0 
          ? watchTimes.reduce((sum, time) => sum + time, 0) / watchTimes.length
          : 0;

        setSummary({
          totalEvents,
          videoViews,
          completionRate: videoViews > 0 ? (videoCompletions / videoViews) * 100 : 0,
          averageWatchTime: Math.round(averageWatchTime / 1000), // Convert to seconds
          topRegions: Object.entries(regionCounts)
            .map(([region, count]) => ({ region, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5),
          languageDistribution: Object.entries(languageCounts)
            .map(([language, count]) => ({ language, count }))
            .sort((a, b) => b.count - a.count),
          errorRate: videoViews > 0 ? (videoErrors / videoViews) * 100 : 0
        });

        // Process video-specific analytics
        const videoStats = events?.reduce((acc: Record<string, any>, event) => {
          if (!event.video_id) return acc;
          
          if (!acc[event.video_id]) {
            acc[event.video_id] = {
              video_id: event.video_id,
              views: 0,
              completions: 0,
              errors: 0,
              watch_times: []
            };
          }

          switch (event.event_type) {
            case 'video_started':
              acc[event.video_id].views++;
              break;
            case 'video_completed':
              acc[event.video_id].completions++;
              if (event.metadata?.watch_duration) {
                acc[event.video_id].watch_times.push(event.metadata.watch_duration);
              }
              break;
            case 'video_error':
              acc[event.video_id].errors++;
              break;
          }

          return acc;
        }, {}) || {};

        const processedVideoAnalytics = Object.values(videoStats).map((stats: any) => ({
          video_id: stats.video_id,
          views: stats.views,
          completions: stats.completions,
          completion_rate: stats.views > 0 ? (stats.completions / stats.views) * 100 : 0,
          errors: stats.errors,
          average_watch_time: stats.watch_times.length > 0 
            ? Math.round(stats.watch_times.reduce((sum: number, time: number) => sum + time, 0) / stats.watch_times.length / 1000)
            : 0
        })) as VideoAnalytics[];

        setVideoAnalytics(processedVideoAnalytics.sort((a, b) => b.views - a.views));

      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  return {
    summary,
    videoAnalytics,
    loading,
    error
  };
};

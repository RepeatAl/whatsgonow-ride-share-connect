
import { useCallback } from 'react';
import { useAnalyticsTracking } from './useAnalyticsTracking';
import type { AdminVideo } from '@/types/admin';

export const useVideoAnalytics = (video: AdminVideo | null) => {
  const { trackVideoEvent } = useAnalyticsTracking();

  const trackVideoStart = useCallback((duration?: number) => {
    if (!video) return;
    
    trackVideoEvent('video_started', video.id, {
      video_title: video.original_name,
      video_duration: duration,
      has_custom_thumbnail: !!video.thumbnail_url,
      is_featured: video.tags?.includes('featured') || false,
      file_size: video.file_size,
      mime_type: video.mime_type
    });
  }, [video, trackVideoEvent]);

  const trackVideoEnd = useCallback((watchedDuration?: number, totalDuration?: number) => {
    if (!video) return;
    
    const completionRate = watchedDuration && totalDuration ? 
      Math.round((watchedDuration / totalDuration) * 100) : undefined;
    
    trackVideoEvent('video_ended', video.id, {
      watched_duration: watchedDuration,
      total_duration: totalDuration,
      completion_rate: completionRate,
      video_title: video.original_name
    });
  }, [video, trackVideoEvent]);

  const trackVideoPause = useCallback((currentTime?: number) => {
    if (!video) return;
    
    trackVideoEvent('video_paused', video.id, {
      pause_time: currentTime,
      video_title: video.original_name
    });
  }, [video, trackVideoEvent]);

  const trackVideoResume = useCallback((currentTime?: number) => {
    if (!video) return;
    
    trackVideoEvent('video_resumed', video.id, {
      resume_time: currentTime,
      video_title: video.original_name
    });
  }, [video, trackVideoEvent]);

  const trackThumbnailClick = useCallback(() => {
    if (!video) return;
    
    trackVideoEvent('thumbnail_clicked', video.id, {
      video_title: video.original_name,
      has_custom_thumbnail: !!video.thumbnail_url,
      is_featured: video.tags?.includes('featured') || false
    });
  }, [video, trackVideoEvent]);

  const trackVideoError = useCallback((error: string) => {
    if (!video) return;
    
    trackVideoEvent('video_error', video.id, {
      error_message: error,
      video_title: video.original_name,
      video_url: video.public_url
    });
  }, [video, trackVideoEvent]);

  return {
    trackVideoStart,
    trackVideoEnd,
    trackVideoPause,
    trackVideoResume,
    trackThumbnailClick,
    trackVideoError
  };
};

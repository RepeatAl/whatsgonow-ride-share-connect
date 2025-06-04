
import { useCallback } from 'react';
import { useAnalyticsTracking } from './useAnalyticsTracking';
import type { AdminVideo } from '@/types/admin';

export const useVideoAnalytics = (video: AdminVideo | null) => {
  const { trackVideoEvent } = useAnalyticsTracking();

  const trackVideoStart = useCallback((videoElement: HTMLVideoElement) => {
    if (!video?.id) return;
    
    trackVideoEvent('video_started', video.id, {
      video_title: video.original_name || video.filename,
      duration: videoElement.duration || 0,
      current_time: videoElement.currentTime || 0,
      video_url: video.public_url || '',
      has_custom_thumbnail: !!video.thumbnail_url,
      is_featured: video.tags?.includes('featured') || false,
      file_size: video.file_size || 0,
      mime_type: video.mime_type || ''
    });
  }, [video, trackVideoEvent]);

  const trackVideoPause = useCallback((videoElement: HTMLVideoElement) => {
    if (!video?.id) return;
    
    trackVideoEvent('video_paused', video.id, {
      video_title: video.original_name || video.filename,
      current_time: videoElement.currentTime || 0,
      duration: videoElement.duration || 0,
      pause_time: videoElement.currentTime || 0
    });
  }, [video, trackVideoEvent]);

  const trackVideoCompleted = useCallback((videoElement: HTMLVideoElement) => {
    if (!video?.id) return;
    
    const duration = videoElement.duration || 0;
    const watchedDuration = videoElement.currentTime || 0;
    const completionRate = duration > 0 ? Math.round((watchedDuration / duration) * 100) : 0;
    
    trackVideoEvent('video_completed', video.id, {
      video_title: video.original_name || video.filename,
      duration: duration,
      watched_duration: watchedDuration,
      completion_rate: completionRate,
      total_duration: duration
    });
  }, [video, trackVideoEvent]);

  const trackVideoError = useCallback((errorMessage: string, errorCode?: string) => {
    if (!video?.id) return;
    
    trackVideoEvent('video_error', video.id, {
      video_title: video.original_name || video.filename,
      error_message: errorMessage,
      error_code: errorCode || 'unknown',
      video_url: video.public_url || ''
    });
  }, [video, trackVideoEvent]);

  const trackVideoSeek = useCallback((videoElement: HTMLVideoElement, fromTime: number) => {
    if (!video?.id) return;
    
    trackVideoEvent('video_seek', video.id, {
      video_title: video.original_name || video.filename,
      from_time: fromTime,
      current_time: videoElement.currentTime || 0,
      duration: videoElement.duration || 0
    });
  }, [video, trackVideoEvent]);

  const trackThumbnailClick = useCallback(() => {
    if (!video?.id) return;
    
    trackVideoEvent('thumbnail_clicked', video.id, {
      video_title: video.original_name || video.filename,
      has_custom_thumbnail: !!video.thumbnail_url,
      is_featured: video.tags?.includes('featured') || false
    });
  }, [video, trackVideoEvent]);

  const resetAnalytics = useCallback(() => {
    // Reset any analytics state if needed
    console.log('🔄 Analytics reset for video:', video?.id);
  }, [video?.id]);

  return {
    trackVideoStart,
    trackVideoPause,
    trackVideoCompleted,
    trackVideoError,
    trackVideoSeek,
    trackThumbnailClick,
    resetAnalytics
  };
};

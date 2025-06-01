
import { useCallback } from 'react';
import { useAnalyticsTracking } from './useAnalyticsTracking';
import type { AdminVideo } from '@/types/admin';

export const useVideoAnalytics = (video: AdminVideo | null) => {
  const { trackVideoEvent } = useAnalyticsTracking();

  const trackVideoStart = useCallback((videoElement?: HTMLVideoElement) => {
    if (!video) return;
    
    const duration = videoElement?.duration;
    trackVideoEvent('video_started', video.id, {
      video_title: video.original_name,
      duration: duration,
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

  const trackVideoCompleted = useCallback((videoElement: HTMLVideoElement) => {
    if (!video || !videoElement) return;
    
    const completionRate = videoElement.duration ? 
      Math.round((videoElement.currentTime / videoElement.duration) * 100) : 100;
    
    trackVideoEvent('video_completed', video.id, {
      watched_duration: videoElement.currentTime,
      total_duration: videoElement.duration,
      completion_rate: completionRate,
      video_title: video.original_name
    });
  }, [video, trackVideoEvent]);

  const trackVideoPause = useCallback((videoElement: HTMLVideoElement) => {
    if (!video || !videoElement) return;
    
    trackVideoEvent('video_paused', video.id, {
      pause_time: videoElement.currentTime,
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

  const trackVideoError = useCallback((error: string, errorCode?: string) => {
    if (!video) return;
    
    trackVideoEvent('video_error', video.id, {
      error_message: error,
      error_code: errorCode,
      video_title: video.original_name,
      video_url: video.public_url
    });
  }, [video, trackVideoEvent]);

  const trackVideoSeek = useCallback((videoElement: HTMLVideoElement, fromTime: number) => {
    if (!video || !videoElement) return;
    
    trackVideoEvent('video_seek', video.id, {
      from_time: fromTime,
      current_time: videoElement.currentTime,
      video_title: video.original_name
    });
  }, [video, trackVideoEvent]);

  const resetAnalytics = useCallback(() => {
    // Reset any local analytics state if needed
    console.log('📊 Video analytics reset for video:', video?.id);
  }, [video?.id]);

  return {
    trackVideoStart,
    trackVideoEnd,
    trackVideoCompleted,
    trackVideoPause,
    trackVideoResume,
    trackThumbnailClick,
    trackVideoError,
    trackVideoSeek,
    resetAnalytics
  };
};

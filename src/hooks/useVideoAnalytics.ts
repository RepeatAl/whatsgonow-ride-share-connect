
import { useRef, useCallback } from 'react';
import { useAnalyticsTracking } from './useAnalyticsTracking';
import type { AdminVideo } from '@/types/admin';
import type { VideoAnalyticsEvent } from '@/types/analytics';

interface VideoAnalyticsState {
  startTime: number | null;
  lastProgressUpdate: number;
  hasStarted: boolean;
  hasCompleted: boolean;
}

export const useVideoAnalytics = (video: AdminVideo | null) => {
  const { trackVideoEvent } = useAnalyticsTracking();
  const analyticsState = useRef<VideoAnalyticsState>({
    startTime: null,
    lastProgressUpdate: 0,
    hasStarted: false,
    hasCompleted: false
  });

  const resetAnalytics = useCallback(() => {
    analyticsState.current = {
      startTime: null,
      lastProgressUpdate: 0,
      hasStarted: false,
      hasCompleted: false
    };
  }, []);

  const trackVideoStart = useCallback((videoElement: HTMLVideoElement) => {
    if (!video || analyticsState.current.hasStarted) return;
    
    analyticsState.current.startTime = Date.now();
    analyticsState.current.hasStarted = true;
    
    trackVideoEvent('video_started', video.id, {
      video_url: video.public_url,
      duration: videoElement.duration || 0,
      current_time: videoElement.currentTime || 0
    });
  }, [video, trackVideoEvent]);

  const trackVideoPause = useCallback((videoElement: HTMLVideoElement) => {
    if (!video || !analyticsState.current.hasStarted) return;
    
    trackVideoEvent('video_paused', video.id, {
      current_time: videoElement.currentTime || 0,
      duration: videoElement.duration || 0,
      completion_percentage: videoElement.duration ? 
        Math.round((videoElement.currentTime / videoElement.duration) * 100) : 0
    });
  }, [video, trackVideoEvent]);

  const trackVideoCompleted = useCallback((videoElement: HTMLVideoElement) => {
    if (!video || analyticsState.current.hasCompleted) return;
    
    analyticsState.current.hasCompleted = true;
    const watchDuration = analyticsState.current.startTime ? 
      Date.now() - analyticsState.current.startTime : 0;
    
    trackVideoEvent('video_completed', video.id, {
      duration: videoElement.duration || 0,
      watch_duration: watchDuration,
      completion_percentage: 100
    });
  }, [video, trackVideoEvent]);

  const trackVideoError = useCallback((error: string, errorCode?: string) => {
    if (!video) return;
    
    trackVideoEvent('video_error', video.id, {
      error_message: error,
      error_code: errorCode || 'unknown'
    });
  }, [video, trackVideoEvent]);

  const trackVideoSeek = useCallback((videoElement: HTMLVideoElement, fromTime: number) => {
    if (!video) return;
    
    trackVideoEvent('video_seek', video.id, {
      current_time: videoElement.currentTime || 0,
      from_time: fromTime,
      duration: videoElement.duration || 0
    });
  }, [video, trackVideoEvent]);

  const trackThumbnailClick = useCallback(() => {
    if (!video) return;
    
    trackVideoEvent('video_thumbnail_clicked', video.id, {
      video_url: video.public_url
    });
  }, [video, trackVideoEvent]);

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

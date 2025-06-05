
import { useState, useRef, useEffect } from 'react';
import { useMobileVideoDetection } from './useMobileVideoDetection';
import { useMobileVideoManager } from './useMobileVideoManager';

interface UseVideoStateProps {
  videoId?: string;
  component?: string;
}

export const useVideoState = (props?: UseVideoStateProps) => {
  const { isMobile } = useMobileVideoDetection();
  const { registerVideo, unregisterVideo, isVideoActive } = useMobileVideoManager(isMobile);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [cacheBustedSrc, setCacheBustedSrc] = useState<string>('');
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Generate unique video ID if not provided
  const videoId = props?.videoId || `video_${Math.random().toString(36).substr(2, 9)}`;
  const component = props?.component || 'unknown';

  // Register/unregister video with mobile manager
  useEffect(() => {
    if (isMobile && videoId) {
      registerVideo(videoId, videoRef, component);
      console.log('📱 Video registered with manager:', { videoId, component, isMobile });
      
      return () => {
        unregisterVideo(videoId);
        console.log('📱 Video unregistered from manager:', videoId);
      };
    }
  }, [videoId, component, isMobile, registerVideo, unregisterVideo]);

  // Update isPlaying based on mobile manager state
  useEffect(() => {
    if (isMobile && videoId) {
      const isActive = isVideoActive(videoId);
      if (isActive !== isPlaying) {
        setIsPlaying(isActive);
        console.log('📱 Video state synced with manager:', { videoId, isActive });
      }
    }
  }, [videoId, isMobile, isVideoActive, isPlaying]);

  return {
    isPlaying,
    setIsPlaying,
    isMuted,
    setIsMuted,
    hasError,
    setHasError,
    isLoading,
    setIsLoading,
    errorDetails,
    setErrorDetails,
    cacheBustedSrc,
    setCacheBustedSrc,
    loadAttempts,
    setLoadAttempts,
    videoLoaded,
    setVideoLoaded,
    debugInfo,
    setDebugInfo,
    videoRef,
    videoId,
    isMobile
  };
};

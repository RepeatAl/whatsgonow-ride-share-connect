
import React, { useState, useRef, useEffect } from "react";
import VideoErrorDisplay from "./video/VideoErrorDisplay";
import VideoLoadingState from "./video/VideoLoadingState";
import VideoOverlay from "./video/VideoOverlay";
import VideoControls from "./video/VideoControls";
import { useVideoAnalytics } from "@/hooks/useVideoAnalytics";
import { useMobileVideoDetection } from "@/hooks/useMobileVideoDetection";
import { useMobileVideoManager } from "@/hooks/useMobileVideoManager";
import type { AdminVideo } from "@/types/admin";

interface VideoPlayerWithAnalyticsProps {
  video: AdminVideo | null;
  src?: string;
  placeholder?: React.ReactNode;
  videoId?: string;
  component?: string;
}

const VideoPlayerWithAnalytics = ({ 
  video, 
  src, 
  placeholder, 
  videoId, 
  component = 'VideoPlayerWithAnalytics' 
}: VideoPlayerWithAnalyticsProps) => {
  const { isMobile } = useMobileVideoDetection();
  const { registerVideo, unregisterVideo, playVideo, pauseVideo, isVideoActive } = useMobileVideoManager(isMobile);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [cacheBustedSrc, setCacheBustedSrc] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSeekTime = useRef<number>(0);

  // Generate unique video ID
  const actualVideoId = videoId || (video ? `analytics_${video.id}` : `video_${Math.random().toString(36).substr(2, 9)}`);

  // Analytics hooks
  const {
    trackVideoStart,
    trackVideoPause,
    trackVideoCompleted,
    trackVideoError,
    trackVideoSeek,
    resetAnalytics
  } = useVideoAnalytics(video);

  // Register with mobile manager
  useEffect(() => {
    if (isMobile && actualVideoId) {
      registerVideo(actualVideoId, videoRef, component);
      console.log('📱 VideoWithAnalytics registered:', { actualVideoId, component });
      
      return () => {
        unregisterVideo(actualVideoId);
        console.log('📱 VideoWithAnalytics unregistered:', actualVideoId);
      };
    }
  }, [actualVideoId, component, isMobile, registerVideo, unregisterVideo]);

  // Sync with mobile manager
  useEffect(() => {
    if (isMobile && actualVideoId) {
      const isActive = isVideoActive(actualVideoId);
      if (isActive !== isPlaying) {
        setIsPlaying(isActive);
        console.log('📱 VideoWithAnalytics state synced:', { actualVideoId, isActive });
      }
    }
  }, [actualVideoId, isMobile, isVideoActive, isPlaying]);

  // Reset analytics when video changes
  useEffect(() => {
    resetAnalytics();
  }, [video?.id, resetAnalytics]);

  // Video source validation and processing
  useEffect(() => {
    console.log('🎬 VideoPlayerWithAnalytics received src:', src);
    console.log('🎬 VideoPlayerWithAnalytics component props:', { 
      videoId, 
      hasVideo: !!video, 
      component, 
      isMobile
    });
    
    // Check if src is provided and valid
    if (!src || src.trim() === '') {
      console.log('❌ No valid src provided to VideoPlayerWithAnalytics');
      setHasError(true);
      setIsLoading(false);
      setErrorDetails('Video URL is empty or missing');
      return;
    }

    // Validate URL format
    const isValidUrl = src.startsWith('http') && (
      src.includes('.mp4') || 
      src.includes('.webm') || 
      src.includes('.ogg') || 
      src.includes('supabase')
    );
    
    console.log('🔍 URL validation:', { src, isValidUrl });
    
    if (!isValidUrl) {
      console.warn('⚠️ Invalid video URL format:', src);
      setHasError(true);
      setIsLoading(false);
      setErrorDetails(`Invalid video URL format: ${src}`);
      trackVideoError(`Invalid video URL format: ${src}`, 'invalid_url');
      return;
    }

    // Process URL - Mobile: no cache busting for better compatibility
    if (isMobile) {
      setCacheBustedSrc(src);
      console.log('📱 Mobile: Using direct URL:', src);
    } else {
      const timestamp = Date.now();
      const cacheBustedUrl = src.includes('?') 
        ? `${src}&t=${timestamp}` 
        : `${src}?t=${timestamp}`;
      setCacheBustedSrc(cacheBustedUrl);
      console.log('🖥️ Desktop: Cache-busted URL:', cacheBustedUrl);
    }

    setHasError(false);
    setIsLoading(true);
    setErrorDetails('');
  }, [src, isMobile, trackVideoError]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered for analytics video:', actualVideoId);
    setHasError(false);
    setIsLoading(true);
    setErrorDetails('');
    resetAnalytics();
    
    if (src) {
      const timestamp = Date.now();
      let newUrl = src;
      
      if (!isMobile) {
        newUrl = src.includes('?') 
          ? `${src}&refresh=${timestamp}` 
          : `${src}?refresh=${timestamp}`;
      }
      
      setCacheBustedSrc(newUrl);
      console.log('🔄 New URL for analytics video:', actualVideoId, newUrl);
    }
  };

  const togglePlay = async () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        if (isMobile) {
          await pauseVideo(actualVideoId);
          trackVideoPause(videoRef.current);
        } else {
          videoRef.current.pause();
          trackVideoPause(videoRef.current);
          setIsPlaying(false);
        }
      } else {
        try {
          if (isMobile) {
            const success = await playVideo(actualVideoId);
            if (success) {
              trackVideoStart(videoRef.current!);
            } else {
              throw new Error('Mobile video manager rejected play request');
            }
          } else {
            await videoRef.current.play();
            trackVideoStart(videoRef.current!);
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('❌ Video play failed:', error);
          setHasError(true);
          setErrorDetails(`Play failed: ${error.message}`);
          trackVideoError(`Play failed: ${error.message}`, 'play_failed');
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current && !hasError) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current && !hasError) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(error => {
          console.error('❌ Fullscreen failed:', error);
        });
      }
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleCanPlay = () => {
    console.log('✅ Analytics video can play:', cacheBustedSrc);
    setIsLoading(false);
    setHasError(false);
    setErrorDetails('');
  };

  const handleError = (error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Analytics video error:', error);
    const videoElement = videoRef.current;
    let errorMessage = 'Unknown video error';
    
    if (videoElement?.error) {
      const { code, message } = videoElement.error;
      errorMessage = `Video Error ${code}: ${message}`;
      console.error('❌ Analytics video error details:', {
        code,
        message,
        src: cacheBustedSrc,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState
      });
    }
    
    setHasError(true);
    setIsLoading(false);
    setErrorDetails(errorMessage);
    trackVideoError(errorMessage, videoElement?.error?.code?.toString());
  };

  const handleLoadStart = () => {
    console.log('🔄 Analytics video load start:', cacheBustedSrc);
    setIsLoading(true);
    setErrorDetails('');
  };

  const handleSeeked = () => {
    if (videoRef.current && lastSeekTime.current !== videoRef.current.currentTime) {
      trackVideoSeek(videoRef.current, lastSeekTime.current);
      lastSeekTime.current = videoRef.current.currentTime;
    }
  };

  const handleEnded = () => {
    if (videoRef.current) {
      trackVideoCompleted(videoRef.current);
      setIsPlaying(false);
    }
  };

  const testDirectAccess = () => {
    if (src) {
      console.log('🔗 Testing direct video access:', src);
      window.open(src, '_blank');
    }
  };

  // Show fallback for missing, empty, or error URLs
  if (!src || src.trim() === '' || hasError) {
    console.log('⚠️ Showing VideoErrorDisplay:', { src, hasError, errorDetails });
    return (
      <VideoErrorDisplay 
        error={errorDetails || "Video URL missing or invalid"}
        src={src || "No source provided"}
        onRefresh={handleRefresh}
        onTestDirectAccess={testDirectAccess}
      />
    );
  }

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Main Video Element with analytics event handlers */}
      <video
        ref={videoRef}
        src={cacheBustedSrc}
        className="w-full aspect-video cursor-pointer"
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onCanPlay={handleCanPlay}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onSeeked={handleSeeked}
        onEnded={handleEnded}
        preload={isMobile ? "none" : "metadata"}
        playsInline
        crossOrigin="anonymous"
        data-video-id={actualVideoId}
        data-component={component}
        data-src-original={src}
      />
      
      {/* Loading Indicator */}
      <VideoLoadingState isLoading={isLoading} />
      
      {/* Video Controls Overlay */}
      {!isLoading && (
        <VideoOverlay 
          isPlaying={isPlaying}
          showControls={showControls}
          onTogglePlay={togglePlay}
        />
      )}
      
      {/* Bottom Controls */}
      {!isLoading && (
        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          showControls={showControls}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onToggleFullscreen={toggleFullscreen}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default VideoPlayerWithAnalytics;

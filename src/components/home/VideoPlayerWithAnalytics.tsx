
import React, { useState, useRef, useEffect } from "react";
import VideoErrorDisplay from "./video/VideoErrorDisplay";
import VideoLoadingState from "./video/VideoLoadingState";
import VideoOverlay from "./video/VideoOverlay";
import VideoControls from "./video/VideoControls";
import { useVideoAnalytics } from "@/hooks/useVideoAnalytics";
import type { AdminVideo } from "@/types/admin";

interface VideoPlayerWithAnalyticsProps {
  video: AdminVideo | null;
  src?: string;
  placeholder?: React.ReactNode;
}

const VideoPlayerWithAnalytics = ({ video, src, placeholder }: VideoPlayerWithAnalyticsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [cacheBustedSrc, setCacheBustedSrc] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSeekTime = useRef<number>(0);

  // Analytics hooks
  const {
    trackVideoStart,
    trackVideoPause,
    trackVideoCompleted,
    trackVideoError,
    trackVideoSeek,
    resetAnalytics
  } = useVideoAnalytics(video);

  // Reset analytics when video changes
  useEffect(() => {
    resetAnalytics();
  }, [video?.id, resetAnalytics]);

  // Cache busting and URL validation
  useEffect(() => {
    console.log('🎬 VideoPlayer received src:', src);
    
    if (!src) {
      console.log('❌ No src provided to VideoPlayer');
      setHasError(true);
      setIsLoading(false);
      setErrorDetails('No video URL provided');
      return;
    }

    const timestamp = Date.now();
    const cacheBustedUrl = src.includes('?') 
      ? `${src}&t=${timestamp}` 
      : `${src}?t=${timestamp}`;
    
    setCacheBustedSrc(cacheBustedUrl);
    console.log('🔄 Cache-busted video URL:', cacheBustedUrl);

    const isValidUrl = src.startsWith('http') && (src.includes('.mp4') || src.includes('.webm') || src.includes('.ogg') || src.includes('supabase'));
    console.log('🔍 URL validation:', { src, isValidUrl });
    
    if (!isValidUrl) {
      console.warn('⚠️ Invalid video URL format:', src);
      setHasError(true);
      setIsLoading(false);
      setErrorDetails(`Invalid video URL format: ${src}`);
      trackVideoError(`Invalid video URL format: ${src}`, 'invalid_url');
      return;
    }

    setHasError(false);
    setIsLoading(true);
    setErrorDetails('');
  }, [src, trackVideoError]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setHasError(false);
    setIsLoading(true);
    setErrorDetails('');
    resetAnalytics();
    
    if (src) {
      const timestamp = Date.now();
      const newCacheBustedUrl = src.includes('?') 
        ? `${src}&refresh=${timestamp}` 
        : `${src}?refresh=${timestamp}`;
      setCacheBustedSrc(newCacheBustedUrl);
      console.log('🔄 New cache-busted URL:', newCacheBustedUrl);
    }
  };

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
        trackVideoPause(videoRef.current);
      } else {
        videoRef.current.play().then(() => {
          trackVideoStart(videoRef.current!);
        }).catch(error => {
          console.error('❌ Video play failed:', error);
          setHasError(true);
          setErrorDetails(`Play failed: ${error.message}`);
          trackVideoError(`Play failed: ${error.message}`, 'play_failed');
        });
      }
      setIsPlaying(!isPlaying);
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
    console.log('✅ Video can play:', cacheBustedSrc);
    setIsLoading(false);
    setHasError(false);
    setErrorDetails('');
  };

  const handleError = (error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video error:', error);
    const videoElement = videoRef.current;
    let errorMessage = 'Unknown video error';
    
    if (videoElement?.error) {
      const { code, message } = videoElement.error;
      errorMessage = `Video Error ${code}: ${message}`;
      console.error('❌ Video error details:', {
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
    console.log('🔄 Video load start:', cacheBustedSrc);
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

  // Fallback for missing or error URLs
  if (!src || hasError) {
    return (
      <VideoErrorDisplay 
        error={errorDetails}
        src={src}
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
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
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

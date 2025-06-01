
import React, { useState, useRef, useEffect } from "react";
import VideoErrorDisplay from "./video/VideoErrorDisplay";
import VideoLoadingState from "./video/VideoLoadingState";
import VideoOverlay from "./video/VideoOverlay";
import VideoControls from "./video/VideoControls";

interface VideoPlayerProps {
  src?: string;
  placeholder?: React.ReactNode;
}

const VideoPlayer = ({ src, placeholder }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [cacheBustedSrc, setCacheBustedSrc] = useState<string>('');
  const [loadAttempts, setLoadAttempts] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

    // Different cache busting strategy for mobile
    const timestamp = Date.now();
    let cacheBustedUrl;
    
    if (isMobile) {
      // For mobile: simpler cache busting without excessive parameters
      cacheBustedUrl = src.includes('?') 
        ? `${src}&v=${timestamp}` 
        : `${src}?v=${timestamp}`;
    } else {
      // For desktop: standard cache busting
      cacheBustedUrl = src.includes('?') 
        ? `${src}&t=${timestamp}` 
        : `${src}?t=${timestamp}`;
    }
    
    setCacheBustedSrc(cacheBustedUrl);
    console.log(`🔄 ${isMobile ? 'Mobile' : 'Desktop'} cache-busted video URL:`, cacheBustedUrl);

    // Simple URL validation
    const isValidUrl = src.startsWith('http') && (src.includes('.mp4') || src.includes('.webm') || src.includes('.ogg') || src.includes('supabase'));
    console.log('🔍 URL validation:', { src, isValidUrl, isMobile });
    
    if (!isValidUrl) {
      console.warn('⚠️ Invalid video URL format:', src);
      setHasError(true);
      setIsLoading(false);
      setErrorDetails(`Invalid video URL format: ${src}`);
      return;
    }

    setHasError(false);
    setIsLoading(true);
    setErrorDetails('');
    setLoadAttempts(0);
  }, [src, isMobile]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setHasError(false);
    setIsLoading(true);
    setErrorDetails('');
    setLoadAttempts(prev => prev + 1);
    
    if (src) {
      const timestamp = Date.now();
      const refreshParam = `refresh_${loadAttempts}_${timestamp}`;
      const newCacheBustedUrl = src.includes('?') 
        ? `${src}&${refreshParam}` 
        : `${src}?${refreshParam}`;
      setCacheBustedSrc(newCacheBustedUrl);
      console.log('🔄 New cache-busted URL:', newCacheBustedUrl);
      
      // Force video reload
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current && !hasError) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Mobile-specific play handling
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('❌ Video play failed:', error);
            setHasError(true);
            setErrorDetails(`Mobile play failed: ${error.message}`);
          });
        }
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
        readyState: videoElement.readyState,
        isMobile,
        loadAttempts
      });
    }
    
    // Auto-retry on mobile for certain errors
    if (isMobile && loadAttempts < 2) {
      console.log('🔄 Auto-retry on mobile, attempt:', loadAttempts + 1);
      setTimeout(() => {
        handleRefresh();
      }, 1000);
      return;
    }
    
    setHasError(true);
    setIsLoading(false);
    setErrorDetails(errorMessage);
  };

  const handleLoadStart = () => {
    console.log(`🔄 Video load start (${isMobile ? 'Mobile' : 'Desktop'}):`, cacheBustedSrc);
    setIsLoading(true);
    setErrorDetails('');
  };

  const handleLoadedMetadata = () => {
    console.log('📊 Video metadata loaded:', {
      duration: videoRef.current?.duration,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
      isMobile
    });
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
      onMouseEnter={() => !isMobile && setShowControls(true)}
      onMouseLeave={() => !isMobile && setShowControls(false)}
      onTouchStart={() => isMobile && setShowControls(true)}
    >
      {/* Main Video Element with mobile-optimized settings */}
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
        onLoadedMetadata={handleLoadedMetadata}
        preload={isMobile ? "none" : "metadata"}
        playsInline
        muted={isMobile} // Start muted on mobile for autoplay policies
        crossOrigin="anonymous"
        controls={false}
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
          isMuted={isMobile ? true : isMuted} // Always show as muted on mobile initially
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

export default VideoPlayer;


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
  const [isMuted, setIsMuted] = useState(true); // Start muted for mobile compatibility
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [cacheBustedSrc, setCacheBustedSrc] = useState<string>('');
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
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

    // Mobile-optimized cache busting
    const timestamp = Date.now();
    let cacheBustedUrl;
    
    if (isMobile) {
      // Simpler cache busting for mobile
      cacheBustedUrl = src.includes('?') 
        ? `${src}&m=${timestamp}` 
        : `${src}?m=${timestamp}`;
    } else {
      cacheBustedUrl = src.includes('?') 
        ? `${src}&t=${timestamp}` 
        : `${src}?t=${timestamp}`;
    }
    
    setCacheBustedSrc(cacheBustedUrl);
    console.log(`🔄 ${isMobile ? 'Mobile' : 'Desktop'} video URL:`, cacheBustedUrl);

    // URL validation
    const isValidUrl = src.startsWith('http') && (src.includes('.mp4') || src.includes('.webm') || src.includes('supabase'));
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
    setVideoLoaded(false);
    setErrorDetails('');
    setLoadAttempts(0);
  }, [src, isMobile]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setHasError(false);
    setIsLoading(true);
    setVideoLoaded(false);
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

  const togglePlay = async () => {
    if (videoRef.current && !hasError && videoLoaded) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          // Mobile-specific play handling
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
            console.log('✅ Video play successful');
          }
        } catch (error) {
          console.error('❌ Video play failed:', error);
          setHasError(true);
          setErrorDetails(`Mobile play failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    console.log('✅ Video can play:', cacheBustedSrc);
    setIsLoading(false);
    setHasError(false);
    setVideoLoaded(true);
    setErrorDetails('');
  };

  const handleLoadedData = () => {
    console.log('📱 Video data loaded for mobile:', cacheBustedSrc);
    setIsLoading(false);
    setVideoLoaded(true);
    setHasError(false);
  };

  const handleError = (error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video error:', error);
    const videoElement = videoRef.current;
    let errorMessage = 'Video konnte nicht geladen werden';
    
    if (videoElement?.error) {
      const { code, message } = videoElement.error;
      console.error('❌ Video error details:', {
        code,
        message,
        src: cacheBustedSrc,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState,
        isMobile,
        loadAttempts
      });
      
      // More descriptive error messages for mobile
      if (isMobile) {
        switch (code) {
          case 1:
            errorMessage = 'Video-Download abgebrochen (mobiles Netzwerk?)';
            break;
          case 2:
            errorMessage = 'Netzwerkfehler beim Video-Laden';
            break;
          case 3:
            errorMessage = 'Video-Format nicht unterstützt auf diesem Gerät';
            break;
          case 4:
            errorMessage = 'Video-Datei nicht gefunden';
            break;
          default:
            errorMessage = `Mobile Video Error ${code}: ${message}`;
        }
      } else {
        errorMessage = `Video Error ${code}: ${message}`;
      }
    }
    
    // Auto-retry logic for mobile
    if (isMobile && loadAttempts < 2) {
      console.log('🔄 Auto-retry on mobile, attempt:', loadAttempts + 1);
      setTimeout(() => {
        handleRefresh();
      }, 1500);
      return;
    }
    
    setHasError(true);
    setIsLoading(false);
    setVideoLoaded(false);
    setErrorDetails(errorMessage);
  };

  const handleLoadStart = () => {
    console.log(`🔄 Video load start (${isMobile ? 'Mobile' : 'Desktop'}):`, cacheBustedSrc);
    setIsLoading(true);
    setVideoLoaded(false);
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
        onLoadedData={handleLoadedData}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onLoadedMetadata={handleLoadedMetadata}
        preload={isMobile ? "metadata" : "metadata"}
        playsInline
        muted={isMuted}
        crossOrigin="anonymous"
        controls={false}
        poster="" // Remove poster to avoid conflicts
      />
      
      {/* Loading Indicator */}
      <VideoLoadingState isLoading={isLoading} />
      
      {/* Video Controls Overlay - only show when video is loaded */}
      {!isLoading && videoLoaded && (
        <VideoOverlay 
          isPlaying={isPlaying}
          showControls={showControls}
          onTogglePlay={togglePlay}
        />
      )}
      
      {/* Bottom Controls - only show when video is loaded */}
      {!isLoading && videoLoaded && (
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
      
      {/* Mobile-specific hint when video is loaded but not playing */}
      {!isLoading && videoLoaded && !isPlaying && isMobile && (
        <div className="absolute bottom-16 left-4 right-4 text-center">
          <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
            Tippen zum Abspielen
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

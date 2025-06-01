
import { useCallback } from 'react';

interface UseVideoHandlersProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  hasError: boolean;
  videoLoaded: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  isMobile: boolean;
  loadAttempts: number;
  src?: string;
  cacheBustedSrc: string;
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setHasError: (error: boolean) => void;
  setVideoLoaded: (loaded: boolean) => void;
  setErrorDetails: (details: string) => void;
  setDebugInfo: (info: string) => void;
  setCacheBustedSrc: (url: string) => void;
  setLoadAttempts: (fn: (prev: number) => number) => void;
}

export const useVideoHandlers = ({
  videoRef,
  hasError,
  videoLoaded,
  isPlaying,
  isMuted,
  isMobile,
  loadAttempts,
  src,
  cacheBustedSrc,
  setIsPlaying,
  setIsMuted,
  setIsLoading,
  setHasError,
  setVideoLoaded,
  setErrorDetails,
  setDebugInfo,
  setCacheBustedSrc,
  setLoadAttempts
}: UseVideoHandlersProps) => {
  
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    setHasError(false);
    setIsLoading(true);
    setVideoLoaded(false);
    setErrorDetails('');
    setLoadAttempts(prev => prev + 1);
    setDebugInfo(`Refresh attempt ${loadAttempts + 1}`);
    
    if (src) {
      const timestamp = Date.now();
      const refreshParam = `refresh_${loadAttempts}_${timestamp}`;
      const newCacheBustedUrl = src.includes('?') 
        ? `${src}&${refreshParam}` 
        : `${src}?${refreshParam}`;
      setCacheBustedSrc(newCacheBustedUrl);
      console.log('🔄 New cache-busted URL:', newCacheBustedUrl);
      setDebugInfo(`Refresh URL: ${newCacheBustedUrl}`);
      
      // Force video reload
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  }, [src, loadAttempts, setCacheBustedSrc, setHasError, setIsLoading, setVideoLoaded, setErrorDetails, setLoadAttempts, setDebugInfo, videoRef]);

  const togglePlay = useCallback(async () => {
    console.log('🎮 Toggle play called - videoLoaded:', videoLoaded, 'hasError:', hasError);
    if (videoRef.current && !hasError && videoLoaded) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setDebugInfo('Video paused');
      } else {
        try {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
            setDebugInfo('Video playing successfully');
            console.log('✅ Video play successful');
          }
        } catch (error) {
          console.error('❌ Video play failed:', error);
          setHasError(true);
          setErrorDetails(`Play failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setDebugInfo(`Play failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } else {
      console.log('🚫 Cannot play - conditions not met');
      setDebugInfo(`Cannot play: hasError=${hasError}, videoLoaded=${videoLoaded}`);
    }
  }, [videoRef, hasError, videoLoaded, isPlaying, setIsPlaying, setDebugInfo, setHasError, setErrorDetails]);

  const toggleMute = useCallback(() => {
    if (videoRef.current && !hasError) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setDebugInfo(`Muted: ${!isMuted}`);
    }
  }, [videoRef, hasError, isMuted, setIsMuted, setDebugInfo]);

  const toggleFullscreen = useCallback(() => {
    if (videoRef.current && !hasError) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(error => {
          console.error('❌ Fullscreen failed:', error);
          setDebugInfo(`Fullscreen failed: ${error.message}`);
        });
      }
    }
  }, [videoRef, hasError, setDebugInfo]);

  const testDirectAccess = useCallback(() => {
    if (src) {
      console.log('🔗 Testing direct video access:', src);
      window.open(src, '_blank');
    }
  }, [src]);

  // CRITICAL FIX: Ensure videoLoaded is set immediately when video can play
  const handleCanPlay = useCallback(() => {
    console.log('✅ Video can play - setting videoLoaded to true:', cacheBustedSrc);
    setIsLoading(false);
    setHasError(false);
    setVideoLoaded(true); // This is the critical line
    setErrorDetails('');
    setDebugInfo('Video ready to play');
    console.log('📺 VIDEO STATE UPDATE: videoLoaded=true, isLoading=false');
  }, [cacheBustedSrc, setIsLoading, setHasError, setVideoLoaded, setErrorDetails, setDebugInfo]);

  const handleLoadedData = useCallback(() => {
    console.log('📱 Video data loaded - ensuring videoLoaded is true:', cacheBustedSrc);
    setIsLoading(false);
    setVideoLoaded(true); // Double ensure this is set
    setHasError(false);
    setDebugInfo('Video data loaded successfully');
    console.log('📺 VIDEO STATE UPDATE: videoLoaded=true from loadedData');
  }, [cacheBustedSrc, setIsLoading, setVideoLoaded, setHasError, setDebugInfo]);

  const handleError = useCallback((error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
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
      
      switch (code) {
        case 1:
          errorMessage = 'Video-Download abgebrochen';
          break;
        case 2:
          errorMessage = 'Netzwerkfehler beim Video-Laden';
          break;
        case 3:
          errorMessage = 'Video-Format nicht unterstützt';
          break;
        case 4:
          errorMessage = 'Video-Datei nicht gefunden';
          break;
        default:
          errorMessage = `Video Error ${code}: ${message}`;
      }
      
      setDebugInfo(`ERROR ${code}: ${message}`);
    }
    
    // Only auto-retry once for mobile
    if (isMobile && loadAttempts === 0) {
      console.log('🔄 Auto-retry on mobile');
      setDebugInfo('Auto-retry in 2 seconds...');
      setTimeout(() => {
        handleRefresh();
      }, 2000);
      return;
    }
    
    setHasError(true);
    setIsLoading(false);
    setVideoLoaded(false);
    setErrorDetails(errorMessage);
  }, [videoRef, cacheBustedSrc, isMobile, loadAttempts, setDebugInfo, setHasError, setIsLoading, setVideoLoaded, setErrorDetails, handleRefresh]);

  const handleLoadStart = useCallback(() => {
    console.log(`🔄 Video load start:`, cacheBustedSrc);
    setIsLoading(true);
    setVideoLoaded(false);
    setErrorDetails('');
    setDebugInfo(`Loading video...`);
  }, [cacheBustedSrc, setIsLoading, setVideoLoaded, setErrorDetails, setDebugInfo]);

  const handleLoadedMetadata = useCallback(() => {
    console.log('📊 Video metadata loaded:', {
      duration: videoRef.current?.duration,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight
    });
    setDebugInfo(`Metadata loaded: ${videoRef.current?.duration}s`);
    
    // Also set videoLoaded here as backup
    console.log('📺 Setting videoLoaded from metadata');
    setVideoLoaded(true);
    setIsLoading(false);
  }, [videoRef, setDebugInfo, setVideoLoaded, setIsLoading]);

  return {
    handleRefresh,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    testDirectAccess,
    handleCanPlay,
    handleLoadedData,
    handleError,
    handleLoadStart,
    handleLoadedMetadata
  };
};

import { useCallback } from 'react';
import { useMobileVideoManager } from './useMobileVideoManager';

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
  videoId: string;
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
  videoId,
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
  
  const { playVideo, pauseVideo } = useMobileVideoManager(isMobile);
  
  const handleRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered for video:', videoId);
    setHasError(false);
    setIsLoading(true);
    setVideoLoaded(false);
    setErrorDetails('');
    setLoadAttempts(prev => prev + 1);
    setDebugInfo(`Refresh attempt ${loadAttempts + 1}`);
    
    if (src) {
      const timestamp = Date.now();
      const refreshParam = `refresh_${loadAttempts}_${timestamp}`;
      
      // Mobile: Kein Cache-Busting für bessere Kompatibilität
      let newUrl = src;
      if (!isMobile) {
        newUrl = src.includes('?') 
          ? `${src}&${refreshParam}` 
          : `${src}?${refreshParam}`;
      }
      
      setCacheBustedSrc(newUrl);
      console.log('🔄 New URL for video:', videoId, newUrl);
      setDebugInfo(`Refresh URL: ${newUrl}`);
      
      // Force video reload
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  }, [src, loadAttempts, videoId, isMobile, setCacheBustedSrc, setHasError, setIsLoading, setVideoLoaded, setErrorDetails, setLoadAttempts, setDebugInfo, videoRef]);

  const togglePlay = useCallback(async () => {
    console.log('🎮 Toggle play called for video:', videoId, { videoLoaded, hasError, isMobile });
    
    if (!videoRef.current || hasError || !videoLoaded) {
      console.log('🚫 Cannot play - conditions not met for video:', videoId);
      setDebugInfo(`Cannot play: hasError=${hasError}, videoLoaded=${videoLoaded}`);
      return;
    }

    if (isPlaying) {
      // Pause video
      if (isMobile) {
        await pauseVideo(videoId);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      setDebugInfo('Video paused');
    } else {
      // Play video
      try {
        let success = true;
        
        if (isMobile) {
          // Use mobile manager for coordinated playback
          success = await playVideo(videoId);
        } else {
          // Direct play for desktop
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
          setIsPlaying(true);
        }
        
        if (success) {
          setDebugInfo('Video playing successfully');
          console.log('✅ Video play successful for:', videoId);
        } else {
          throw new Error('Mobile video manager rejected play request');
        }
      } catch (error) {
        console.error('❌ Video play failed for:', videoId, error);
        setHasError(true);
        setErrorDetails(`Play failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setDebugInfo(`Play failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [videoRef, hasError, videoLoaded, isPlaying, videoId, isMobile, setIsPlaying, setDebugInfo, setHasError, setErrorDetails, playVideo, pauseVideo]);

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

  const handleCanPlay = useCallback(() => {
    console.log('✅ Video can play:', videoId, cacheBustedSrc);
    setIsLoading(false);
    setHasError(false);
    setVideoLoaded(true);
    setErrorDetails('');
    setDebugInfo('Video ready to play');
    console.log('📺 VIDEO STATE UPDATE: videoLoaded=true, isLoading=false');
  }, [videoId, cacheBustedSrc, setIsLoading, setHasError, setVideoLoaded, setErrorDetails, setDebugInfo]);

  const handleLoadedData = useCallback(() => {
    console.log('📱 Video data loaded:', videoId, cacheBustedSrc);
    setIsLoading(false);
    setVideoLoaded(true);
    setHasError(false);
    setDebugInfo('Video data loaded successfully');
    console.log('📺 VIDEO STATE UPDATE: videoLoaded=true from loadedData');
  }, [videoId, cacheBustedSrc, setIsLoading, setVideoLoaded, setHasError, setDebugInfo]);

  const handleError = useCallback((error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video error for:', videoId, error);
    const videoElement = videoRef.current;
    let errorMessage = 'Video konnte nicht geladen werden';
    
    if (videoElement?.error) {
      const { code, message } = videoElement.error;
      console.error('❌ Video error details:', {
        videoId,
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
      console.log('🔄 Auto-retry on mobile for video:', videoId);
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
  }, [videoRef, videoId, cacheBustedSrc, isMobile, loadAttempts, setDebugInfo, setHasError, setIsLoading, setVideoLoaded, setErrorDetails, handleRefresh]);

  const handleLoadStart = useCallback(() => {
    console.log(`🔄 Video load start:`, videoId, cacheBustedSrc);
    setIsLoading(true);
    setVideoLoaded(false);
    setErrorDetails('');
    setDebugInfo(`Loading video...`);
  }, [videoId, cacheBustedSrc, setIsLoading, setVideoLoaded, setErrorDetails, setDebugInfo]);

  const handleLoadedMetadata = useCallback(() => {
    console.log('📊 Video metadata loaded for:', videoId, {
      duration: videoRef.current?.duration,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight
    });
    setDebugInfo(`Metadata loaded: ${videoRef.current?.duration}s`);
    setVideoLoaded(true);
    setIsLoading(false);
  }, [videoId, videoRef, setDebugInfo, setVideoLoaded, setIsLoading]);

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

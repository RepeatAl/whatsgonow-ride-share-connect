
import { useEffect } from 'react';

interface UseVideoUrlProps {
  src?: string;
  isMobile: boolean;
  setCacheBustedSrc: (url: string) => void;
  setHasError: (error: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setErrorDetails: (details: string) => void;
  setDebugInfo: (info: string) => void;
  setVideoLoaded: (loaded: boolean) => void;
  setLoadAttempts: (attempts: number) => void;
}

export const useVideoUrl = ({
  src,
  isMobile,
  setCacheBustedSrc,
  setHasError,
  setIsLoading,
  setErrorDetails,
  setDebugInfo,
  setVideoLoaded,
  setLoadAttempts
}: UseVideoUrlProps) => {
  useEffect(() => {
    console.log('🎬 VideoPlayer received src:', src);
    setDebugInfo(`Received src: ${src || 'NO SRC'}`);
    
    if (!src) {
      console.log('❌ No src provided to VideoPlayer');
      setHasError(true);
      setIsLoading(false);
      setErrorDetails('No video URL provided');
      setDebugInfo('ERROR: No video URL provided');
      return;
    }

    // Simple URL for mobile - no cache busting initially
    if (isMobile) {
      setCacheBustedSrc(src);
      console.log('📱 Mobile: Using direct URL:', src);
      setDebugInfo(`Mobile: Direct URL: ${src}`);
    } else {
      const timestamp = Date.now();
      const cacheBustedUrl = src.includes('?') 
        ? `${src}&t=${timestamp}` 
        : `${src}?t=${timestamp}`;
      setCacheBustedSrc(cacheBustedUrl);
      console.log('🖥️ Desktop: Cache-busted URL:', cacheBustedUrl);
      setDebugInfo(`Desktop: Cache-busted URL: ${cacheBustedUrl}`);
    }

    // URL validation
    const isValidUrl = src.startsWith('http') && (src.includes('.mp4') || src.includes('.webm') || src.includes('supabase'));
    console.log('🔍 URL validation:', { src, isValidUrl, isMobile });
    
    if (!isValidUrl) {
      console.warn('⚠️ Invalid video URL format:', src);
      setHasError(true);
      setIsLoading(false);
      setErrorDetails(`Invalid video URL format: ${src}`);
      setDebugInfo(`ERROR: Invalid URL format: ${src}`);
      return;
    }

    setHasError(false);
    setIsLoading(true);
    setVideoLoaded(false);
    setErrorDetails('');
    setLoadAttempts(0);
  }, [src, isMobile, setCacheBustedSrc, setHasError, setIsLoading, setErrorDetails, setDebugInfo, setVideoLoaded, setLoadAttempts]);
};

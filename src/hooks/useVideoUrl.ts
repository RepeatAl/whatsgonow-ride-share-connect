
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
    console.log('🎬 VideoPlayer processing src:', src);
    
    if (!src) {
      console.log('❌ No src provided');
      setHasError(true);
      setIsLoading(false);
      setErrorDetails('No video URL provided');
      setDebugInfo('ERROR: No video URL provided');
      return;
    }

    // Reset states
    setHasError(false);
    setIsLoading(true);
    setVideoLoaded(false);
    setErrorDetails('');
    setLoadAttempts(0);

    // Simplified URL validation - just check if it's a valid URL
    let isValidUrl = false;
    try {
      new URL(src);
      isValidUrl = true;
    } catch {
      // If it's a relative path or doesn't start with http, still try it
      isValidUrl = src.length > 0;
    }

    console.log('🔍 URL validation:', { src, isValidUrl });
    setDebugInfo(`Processing: ${src}`);
    
    if (!isValidUrl) {
      console.warn('⚠️ Invalid URL:', src);
      setHasError(true);
      setIsLoading(false);
      setErrorDetails(`Invalid video URL: ${src}`);
      setDebugInfo(`ERROR: Invalid URL: ${src}`);
      return;
    }

    // Set the URL - no cache busting for mobile initially
    if (isMobile) {
      setCacheBustedSrc(src);
      console.log('📱 Mobile: Using direct URL:', src);
      setDebugInfo(`Mobile: Loading ${src}`);
    } else {
      const timestamp = Date.now();
      const cacheBustedUrl = src.includes('?') 
        ? `${src}&t=${timestamp}` 
        : `${src}?t=${timestamp}`;
      setCacheBustedSrc(cacheBustedUrl);
      console.log('🖥️ Desktop: Cache-busted URL:', cacheBustedUrl);
      setDebugInfo(`Desktop: Loading ${cacheBustedUrl}`);
    }

  }, [src, isMobile, setCacheBustedSrc, setHasError, setIsLoading, setErrorDetails, setDebugInfo, setVideoLoaded, setLoadAttempts]);
};

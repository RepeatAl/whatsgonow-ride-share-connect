
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

    // Enhanced URL validation for Supabase storage
    let isValidUrl = false;
    let validationInfo = '';
    
    try {
      const url = new URL(src);
      
      // Check if it's a valid Supabase storage URL
      if (url.hostname.includes('supabase.co') && url.pathname.includes('/storage/v1/object/public/')) {
        isValidUrl = true;
        validationInfo = 'Valid Supabase Storage URL';
      } else if (url.protocol === 'https:' && (src.includes('.mp4') || src.includes('.webm') || src.includes('.ogg'))) {
        isValidUrl = true;
        validationInfo = 'Valid external video URL';
      } else {
        validationInfo = 'URL format not recognized as video';
      }
    } catch {
      // If it's a relative path, still try it
      if (src.length > 0 && !src.startsWith('http')) {
        isValidUrl = true;
        validationInfo = 'Relative path - attempting to load';
      } else {
        validationInfo = 'Invalid URL format';
      }
    }

    console.log('🔍 Enhanced URL validation:', { 
      src, 
      isValidUrl, 
      validationInfo,
      isSupabaseUrl: src.includes('supabase.co'),
      hasVideoExtension: ['.mp4', '.webm', '.ogg'].some(ext => src.includes(ext))
    });
    
    setDebugInfo(`Processing: ${validationInfo}`);
    
    if (!isValidUrl) {
      console.warn('⚠️ Invalid URL:', src);
      setHasError(true);
      setIsLoading(false);
      setErrorDetails(`Invalid video URL: ${validationInfo}`);
      setDebugInfo(`ERROR: ${validationInfo}`);
      return;
    }

    // FIXED: Better cache-busting strategy for different environments
    if (isMobile) {
      // Mobile: Use direct URL first, add cache-buster only if needed
      setCacheBustedSrc(src);
      console.log('📱 Mobile: Using direct URL:', src);
      setDebugInfo(`Mobile: Loading ${src}`);
    } else {
      // Desktop: Aggressive cache-busting for development
      const separator = src.includes('?') ? '&' : '?';
      const timestamp = Date.now();
      const cacheBustedUrl = `${src}${separator}t=${timestamp}&cache_bust=1`;
      setCacheBustedSrc(cacheBustedUrl);
      console.log('🖥️ Desktop: Cache-busted URL:', cacheBustedUrl);
      setDebugInfo(`Desktop: Loading ${cacheBustedUrl}`);
    }

    // Test URL accessibility (optional ping)
    if (src.startsWith('http')) {
      fetch(src, { method: 'HEAD', mode: 'no-cors' })
        .then(() => {
          console.log('✅ URL accessibility check passed:', src);
          setDebugInfo(prev => `${prev} - URL accessible`);
        })
        .catch(error => {
          console.warn('⚠️ URL accessibility check failed:', error);
          setDebugInfo(prev => `${prev} - URL check failed`);
        });
    }

  }, [src, isMobile, setCacheBustedSrc, setHasError, setIsLoading, setErrorDetails, setDebugInfo, setVideoLoaded, setLoadAttempts]);
};


import { useState, useEffect, useRef } from 'react';
import type { AdminVideo } from '@/types/admin';

interface VideoThumbnailResult {
  thumbnailUrl: string;
  isLoading: boolean;
  error: string | null;
  hasCustomThumbnail: boolean;
  altText: string;
}

export const useVideoThumbnail = (
  video: AdminVideo, 
  currentLanguage: string = 'de'
): VideoThumbnailResult => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCustomThumbnail, setHasCustomThumbnail] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get localized alt text with graceful fallback
  const getAltText = (): string => {
    // Safety check for video and video properties
    if (!video) return 'Video';
    
    // Try to get alt text from thumbnail_titles (new structure)
    if (video.thumbnail_titles && typeof video.thumbnail_titles === 'object') {
      const langKey = currentLanguage?.split('-')[0] || 'de';
      const altTexts = video.thumbnail_titles as Record<string, string>;
      
      const altText = altTexts[langKey] || altTexts.de || altTexts.en || altTexts.ar;
      if (altText) return altText;
    }
    
    // Fallback to original name or generic text
    return video.original_name || video.filename || 'Video Tutorial';
  };

  useEffect(() => {
    if (!video) {
      console.warn('🎬 useVideoThumbnail: No video provided');
      setThumbnailUrl('/placeholders/video-placeholder.svg');
      setIsLoading(false);
      return;
    }

    console.log('🎬 useVideoThumbnail: Processing video', video.id);
    
    // Reset state
    setIsLoading(true);
    setError(null);
    setHasCustomThumbnail(false);

    // Priority 1: Custom uploaded thumbnail (graceful handling if column doesn't exist)
    try {
      if (video.thumbnail_url && typeof video.thumbnail_url === 'string' && video.thumbnail_url.trim()) {
        console.log('✅ Using custom thumbnail:', video.thumbnail_url);
        setThumbnailUrl(video.thumbnail_url);
        setHasCustomThumbnail(true);
        setIsLoading(false);
        return;
      }
    } catch (thumbnailError) {
      console.warn('⚠️ Error accessing thumbnail_url field, using fallback:', thumbnailError);
    }

    // Priority 2: Professional brand placeholder (always available)
    console.log('📷 Using brand placeholder for video:', video.id);
    setThumbnailUrl('/placeholders/video-placeholder.svg');
    setIsLoading(false);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [video?.id, video?.thumbnail_url]);

  return {
    thumbnailUrl,
    isLoading,
    error,
    hasCustomThumbnail,
    altText: getAltText()
  };
};

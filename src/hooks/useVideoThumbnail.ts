
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get localized alt text
  const getAltText = (): string => {
    if (!video.thumbnail_titles) return video.original_name;
    
    const langKey = currentLanguage?.split('-')[0] || 'de';
    const altTexts = video.thumbnail_titles as Record<string, string>;
    
    return altTexts[langKey] || altTexts.de || altTexts.en || altTexts.ar || video.original_name;
  };

  useEffect(() => {
    console.log('🎬 useVideoThumbnail: Processing video', video.id);
    
    // Reset state
    setIsLoading(true);
    setError(null);
    setHasCustomThumbnail(false);

    // Priority 1: Custom uploaded thumbnail
    if (video.thumbnail_url) {
      console.log('✅ Using custom thumbnail:', video.thumbnail_url);
      setThumbnailUrl(video.thumbnail_url);
      setHasCustomThumbnail(true);
      setIsLoading(false);
      return;
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
  }, [video.id, video.thumbnail_url]);

  return {
    thumbnailUrl,
    isLoading,
    error,
    hasCustomThumbnail,
    altText: getAltText()
  };
};

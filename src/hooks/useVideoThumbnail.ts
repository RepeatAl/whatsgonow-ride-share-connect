
import { useState, useEffect, useRef } from 'react';
import type { AdminVideo } from '@/types/admin';

interface VideoThumbnailResult {
  thumbnailUrl: string | null;
  isLoading: boolean;
  error: string | null;
  hasCustomThumbnail: boolean;
}

export const useVideoThumbnail = (video: AdminVideo): VideoThumbnailResult => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCustomThumbnail, setHasCustomThumbnail] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🎬 useVideoThumbnail: Processing video', video.id);
    
    // Reset state
    setIsLoading(true);
    setError(null);
    setThumbnailUrl(null);
    setHasCustomThumbnail(false);

    // Priority 1: Custom uploaded thumbnail
    if (video.thumbnail_url) {
      console.log('✅ Using custom thumbnail:', video.thumbnail_url);
      setThumbnailUrl(video.thumbnail_url);
      setHasCustomThumbnail(true);
      setIsLoading(false);
      return;
    }

    // Priority 2: Generate from video
    if (video.public_url) {
      generateThumbnailFromVideo();
    } else {
      // Priority 3: Fallback placeholder
      console.log('📷 Using placeholder thumbnail for video:', video.id);
      setThumbnailUrl('/placeholders/video-placeholder.svg');
      setIsLoading(false);
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (thumbnailUrl && thumbnailUrl.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [video.id, video.public_url, video.thumbnail_url]);

  const generateThumbnailFromVideo = () => {
    // Create video element dynamically
    const videoElement = document.createElement('video');
    const canvas = document.createElement('canvas');
    videoRef.current = videoElement;
    canvasRef.current = canvas;

    // Set timeout for thumbnail generation (3 seconds max)
    timeoutRef.current = setTimeout(() => {
      console.warn('⏰ Thumbnail generation timeout for video:', video.id);
      setThumbnailUrl('/placeholders/video-placeholder.svg');
      setError('Thumbnail generation timeout');
      setIsLoading(false);
      cleanup();
    }, 3000);

    const handleLoadedData = () => {
      try {
        console.log('📊 Video loaded, generating thumbnail for:', video.id);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Set canvas dimensions (16:9 aspect ratio)
        canvas.width = 320;
        canvas.height = 180;

        // Seek to start of video for thumbnail
        videoElement.currentTime = 0.1; // Small offset to avoid black frame
      } catch (error) {
        console.error('❌ Error in handleLoadedData:', error);
        fallbackToPlaceholder();
      }
    };

    const handleSeeked = () => {
      try {
        console.log('🎯 Video seeked, drawing thumbnail for:', video.id);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Draw the current frame to canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            console.log('✅ Thumbnail generated successfully for video:', video.id);
            setThumbnailUrl(url);
            setError(null);
          } else {
            console.warn('📷 Failed to create blob from canvas');
            fallbackToPlaceholder();
          }
          cleanup();
          setIsLoading(false);
        }, 'image/jpeg', 0.8);
      } catch (error) {
        console.error('❌ Error in handleSeeked:', error);
        fallbackToPlaceholder();
      }
    };

    const handleError = (error: Event) => {
      console.error('❌ Video loading error for:', video.public_url, error);
      fallbackToPlaceholder();
    };

    const fallbackToPlaceholder = () => {
      setThumbnailUrl('/placeholders/video-placeholder.svg');
      setError('Video thumbnail generation failed');
      cleanup();
      setIsLoading(false);
    };

    const cleanup = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('seeked', handleSeeked);
      videoElement.removeEventListener('error', handleError);
    };

    // Set up event listeners
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('seeked', handleSeeked);
    videoElement.addEventListener('error', handleError);

    // Configure video element
    videoElement.preload = 'metadata';
    videoElement.muted = true;
    videoElement.playsInline = true;

    // Start loading - no crossOrigin to avoid CORS issues
    videoElement.src = video.public_url!;
    videoElement.load();
  };

  return {
    thumbnailUrl: thumbnailUrl || '/placeholders/video-placeholder.svg',
    isLoading,
    error,
    hasCustomThumbnail
  };
};

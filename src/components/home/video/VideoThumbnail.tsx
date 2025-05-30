
import React, { useState, useRef, useEffect } from "react";
import { Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AdminVideo } from "@/types/admin";

interface VideoThumbnailProps {
  video: AdminVideo;
  onVideoSelect: (video: AdminVideo) => void;
  getLocalizedTitle: (video: AdminVideo) => string;
  getLocalizedDescription: (video: AdminVideo) => string;
}

const VideoThumbnail = ({ 
  video, 
  onVideoSelect, 
  getLocalizedTitle, 
  getLocalizedDescription 
}: VideoThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (video.public_url) {
      generateThumbnail();
    }
  }, [video.public_url]);

  const generateThumbnail = () => {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!videoElement || !canvas) return;

    const handleLoadedData = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions to match video aspect ratio
      canvas.width = 320;
      canvas.height = 180;

      // Seek to 1 second (or 10% of duration, whichever is smaller)
      const seekTime = Math.min(1, videoElement.duration * 0.1);
      videoElement.currentTime = seekTime;
    };

    const handleSeeked = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw the current frame to canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setThumbnailUrl(url);
          setIsLoading(false);
        }
      }, 'image/jpeg', 0.8);
    };

    const handleError = () => {
      console.warn('Failed to generate thumbnail for video:', video.public_url);
      setIsLoading(false);
    };

    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('seeked', handleSeeked);
    videoElement.addEventListener('error', handleError);

    // Start loading the video
    videoElement.load();

    // Cleanup function
    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('seeked', handleSeeked);
      videoElement.removeEventListener('error', handleError);
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  };

  return (
    <div
      className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={() => onVideoSelect(video)}
    >
      {/* Hidden video element for thumbnail generation */}
      <video
        ref={videoRef}
        src={video.public_url}
        className="hidden"
        preload="metadata"
        muted
        crossOrigin="anonymous"
      />
      
      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Thumbnail Display */}
      <div className="aspect-video bg-gradient-to-br from-brand-primary to-brand-orange flex items-center justify-center relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={getLocalizedTitle(video)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-center">
            <Play className="h-12 w-12 mx-auto mb-2" />
            <span className="text-sm">Thumbnail nicht verfügbar</span>
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
        </div>

        {/* Featured badge */}
        {video.tags?.includes('featured') && (
          <Badge 
            variant="default" 
            className="absolute top-2 right-2 bg-orange-100 text-orange-800 border-orange-200"
          >
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>
      
      {/* Video Info */}
      <div className="p-4">
        <h5 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">
          {getLocalizedTitle(video)}
        </h5>
        <p className="text-sm text-gray-600 line-clamp-2">
          {getLocalizedDescription(video)}
        </p>
        
        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoThumbnail;

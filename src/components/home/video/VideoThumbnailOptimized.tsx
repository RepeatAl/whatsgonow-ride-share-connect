
import React from "react";
import { Play, Star, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVideoThumbnail } from "@/hooks/useVideoThumbnail";
import type { AdminVideo } from "@/types/admin";

interface VideoThumbnailOptimizedProps {
  video: AdminVideo;
  onVideoSelect: (video: AdminVideo) => void;
  getLocalizedTitle: (video: AdminVideo) => string;
  getLocalizedDescription: (video: AdminVideo) => string;
  currentLanguage: string;
}

const VideoThumbnailOptimized = ({ 
  video, 
  onVideoSelect, 
  getLocalizedTitle, 
  getLocalizedDescription,
  currentLanguage 
}: VideoThumbnailOptimizedProps) => {
  const { thumbnailUrl, isLoading, hasCustomThumbnail, altText } = useVideoThumbnail(video, currentLanguage);

  // Safety check for video object
  if (!video) {
    console.warn('🔍 VideoThumbnailOptimized: No video provided');
    return null;
  }

  console.log('🔍 VideoThumbnailOptimized rendering:', { 
    id: video.id, 
    thumbnailUrl,
    isLoading,
    hasCustomThumbnail,
    altText
  });

  const handleVideoClick = () => {
    try {
      onVideoSelect(video);
    } catch (error) {
      console.error('Error selecting video:', error);
    }
  };

  return (
    <div
      className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={handleVideoClick}
    >
      {/* Thumbnail Display */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          </div>
        ) : (
          <img 
            src={thumbnailUrl}
            alt={altText}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to brand placeholder if any thumbnail fails
              console.warn('🔄 Thumbnail failed, using fallback:', thumbnailUrl);
              const target = e.target as HTMLImageElement;
              if (target.src !== '/placeholders/video-placeholder.svg') {
                target.src = '/placeholders/video-placeholder.svg';
              }
            }}
          />
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3">
            <Play className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {video.tags?.includes('featured') && (
            <Badge 
              variant="default" 
              className="bg-orange-100 text-orange-800 border-orange-200"
            >
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          
          {hasCustomThumbnail && (
            <Badge 
              variant="outline" 
              className="bg-white bg-opacity-90 text-gray-700"
              title="Custom Thumbnail"
            >
              <Upload className="h-3 w-3" />
            </Badge>
          )}
        </div>

        {/* Video quality indicator */}
        {!isLoading && (
          <div className="absolute bottom-2 left-2">
            <Badge 
              variant="outline" 
              className="bg-black bg-opacity-50 text-white border-white border-opacity-30 text-xs"
            >
              HD
            </Badge>
          </div>
        )}
      </div>
      
      {/* Video Info */}
      <div className="p-4">
        <h5 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">
          {getLocalizedTitle(video)}
        </h5>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {getLocalizedDescription(video)}
        </p>
        
        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
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

export default VideoThumbnailOptimized;

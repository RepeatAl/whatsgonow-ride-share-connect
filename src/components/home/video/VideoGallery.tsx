
import React, { useState } from "react";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "../VideoPlayer";
import VideoThumbnailOptimized from "./VideoThumbnailOptimized";
import type { AdminVideo } from "@/types/admin";

interface VideoGalleryProps {
  videos: AdminVideo[];
  currentLanguage: string;
}

const VideoGallery = ({ videos, currentLanguage }: VideoGalleryProps) => {
  const [currentVideo, setCurrentVideo] = useState<AdminVideo | null>(videos[0] || null);

  console.log('🎥 VideoGallery rendering with videos:', {
    count: videos.length,
    currentVideo: currentVideo?.id,
    language: currentLanguage
  });

  // Function to get localized title with fallback logic
  const getLocalizedTitle = (video: AdminVideo): string => {
    const langKey = currentLanguage?.split('-')[0] || 'de';
    
    if (video.display_titles && typeof video.display_titles === 'object') {
      const titles = video.display_titles as Record<string, string>;
      return titles[langKey] || titles.de || titles.en || titles.ar || video.original_name;
    }
    
    switch (langKey) {
      case 'en':
        return video.display_title_en || video.display_title_de || video.original_name;
      case 'ar':
        return video.display_title_ar || video.display_title_en || video.display_title_de || video.original_name;
      default:
        return video.display_title_de || video.display_title_en || video.original_name;
    }
  };

  // Function to get localized description with fallback logic
  const getLocalizedDescription = (video: AdminVideo): string => {
    const langKey = currentLanguage?.split('-')[0] || 'de';
    
    if (video.display_descriptions && typeof video.display_descriptions === 'object') {
      const descriptions = video.display_descriptions as Record<string, string>;
      return descriptions[langKey] || descriptions.de || descriptions.en || descriptions.ar || video.description || '';
    }
    
    switch (langKey) {
      case 'en':
        return video.display_description_en || video.display_description_de || video.description || '';
      case 'ar':
        return video.display_description_ar || video.display_description_en || video.display_description_de || video.description || '';
      default:
        return video.display_description_de || video.display_description_en || video.description || '';
    }
  };

  const handleVideoSelect = (video: AdminVideo) => {
    console.log('🎯 Video selected:', video.id, video.public_url);
    setCurrentVideo(video);
  };

  if (!videos.length) {
    return (
      <div className="text-center py-8">
        <img 
          src="/placeholders/video-placeholder.svg" 
          alt="Keine Videos verfügbar"
          className="h-32 w-48 mx-auto mb-4 opacity-50"
        />
        <p className="text-gray-600">Keine Videos verfügbar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Video Player */}
      {currentVideo && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-semibold text-gray-900">
              {getLocalizedTitle(currentVideo)}
            </h3>
            {currentVideo.tags?.includes('featured') && (
              <Badge variant="default" className="bg-orange-100 text-orange-800 border-orange-200">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          <p className="text-gray-600">
            {getLocalizedDescription(currentVideo)}
          </p>
          <VideoPlayer src={currentVideo.public_url} />
        </div>
      )}

      {/* Video Gallery - Professional Thumbnails */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">
          Alle Videos ({videos.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => {
            console.log('🔍 Rendering optimized video card:', { 
              id: video.id, 
              hasUrl: !!video.public_url, 
              url: video.public_url,
              hasThumbnail: !!video.thumbnail_url,
              isSelected: currentVideo?.id === video.id 
            });
            
            return (
              <div
                key={video.id}
                className={`${
                  currentVideo?.id === video.id 
                    ? 'ring-2 ring-brand-orange ring-offset-2' 
                    : ''
                }`}
              >
                <VideoThumbnailOptimized
                  video={video}
                  onVideoSelect={handleVideoSelect}
                  getLocalizedTitle={getLocalizedTitle}
                  getLocalizedDescription={getLocalizedDescription}
                  currentLanguage={currentLanguage}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;

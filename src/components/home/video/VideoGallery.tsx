
import React, { useState } from "react";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoPlayer from "../VideoPlayer";
import type { AdminVideo } from "@/types/admin";

interface VideoGalleryProps {
  videos: AdminVideo[];
  currentLanguage: string;
}

const VideoGallery = ({ videos, currentLanguage }: VideoGalleryProps) => {
  // Bestimme das Featured Video (erstes mit 'featured' Tag oder erstes Video)
  const featuredVideo = videos.find(video => video.tags?.includes('featured')) || videos[0];
  const galleryVideos = videos.filter(video => video.id !== featuredVideo?.id);
  
  const [currentVideo, setCurrentVideo] = useState<AdminVideo | null>(featuredVideo || null);

  // Funktion um den lokalisierten Titel zu bekommen mit Fallback-Logik
  const getLocalizedTitle = (video: AdminVideo): string => {
    const langKey = currentLanguage?.split('-')[0] || 'de';
    
    // Versuche zuerst JSON-Struktur, dann Fallback auf einzelne Spalten
    if (video.display_titles && typeof video.display_titles === 'object') {
      const titles = video.display_titles as Record<string, string>;
      return titles[langKey] || titles.de || titles.en || titles.ar || video.original_name;
    }
    
    // Fallback auf alte Spaltenstruktur
    switch (langKey) {
      case 'en':
        return video.display_title_en || video.display_title_de || video.original_name;
      case 'ar':
        return video.display_title_ar || video.display_title_en || video.display_title_de || video.original_name;
      default:
        return video.display_title_de || video.display_title_en || video.original_name;
    }
  };

  // Funktion um die lokalisierte Beschreibung zu bekommen mit Fallback-Logik
  const getLocalizedDescription = (video: AdminVideo): string => {
    const langKey = currentLanguage?.split('-')[0] || 'de';
    
    // Versuche zuerst JSON-Struktur, dann Fallback auf einzelne Spalten
    if (video.display_descriptions && typeof video.display_descriptions === 'object') {
      const descriptions = video.display_descriptions as Record<string, string>;
      return descriptions[langKey] || descriptions.de || descriptions.en || descriptions.ar || video.description || '';
    }
    
    // Fallback auf alte Spaltenstruktur
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
    setCurrentVideo(video);
  };

  if (!videos.length) {
    return (
      <div className="text-center py-8">
        <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-gray-600">Keine Videos verfügbar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Video Player */}
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

      {/* Video Gallery Thumbnails */}
      {galleryVideos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            Weitere Videos ({galleryVideos.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryVideos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => handleVideoSelect(video)}
              >
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-brand-primary to-brand-orange flex items-center justify-center relative">
                  <Play className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;

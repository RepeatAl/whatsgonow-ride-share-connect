
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import type { AdminVideo } from '@/types/admin';

interface VideoGalleryWithAnalyticsProps {
  videos: AdminVideo[];
  currentLanguage: string;
}

const VideoGalleryWithAnalytics: React.FC<VideoGalleryWithAnalyticsProps> = ({
  videos,
  currentLanguage
}) => {
  const { t } = useTranslation(['landing', 'common']);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  // Filter only active videos with valid URLs
  const activeVideos = videos.filter(video => 
    video.active && 
    video.public && 
    video.public_url &&
    !videoErrors.has(video.id)
  );

  const handleVideoPlay = async (video: AdminVideo) => {
    const videoElement = videoRefs.current[video.id];
    if (!videoElement) return;

    try {
      // Stop other videos
      Object.entries(videoRefs.current).forEach(([id, element]) => {
        if (id !== video.id && !element.paused) {
          element.pause();
        }
      });

      setPlayingVideo(video.id);
      await videoElement.play();

      // Track analytics
      await supabase.from('analytics_events').insert({
        event_type: 'video_play',
        video_id: video.id,
        video_title: video.display_title_de || video.original_name,
        language: currentLanguage,
        metadata: {
          video_filename: video.filename,
          user_agent: navigator.userAgent
        }
      });

    } catch (error) {
      console.error('❌ Video play failed:', error);
      setVideoErrors(prev => new Set([...prev, video.id]));
    }
  };

  const handleVideoPause = (video: AdminVideo) => {
    const videoElement = videoRefs.current[video.id];
    if (videoElement) {
      videoElement.pause();
      setPlayingVideo(null);
    }
  };

  const handleVideoError = (video: AdminVideo, error: any) => {
    console.error('❌ Video error for', video.id, ':', error);
    setVideoErrors(prev => new Set([...prev, video.id]));
    setPlayingVideo(null);
  };

  const retryVideo = (video: AdminVideo) => {
    setVideoErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(video.id);
      return newSet;
    });
    
    // Force reload the video element
    const videoElement = videoRefs.current[video.id];
    if (videoElement) {
      videoElement.load();
    }
  };

  const getVideoTitle = (video: AdminVideo) => {
    return video.display_title_de || video.original_name || video.filename || 'Untitled Video';
  };

  if (activeVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">
          {t('landing:how_it_works.video.title', 'Was ist Whatsgonow?')}
        </h3>
        <p className="text-sm opacity-75">
          Videos werden in Kürze hinzugefügt.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          {activeVideos.length} Video{activeVideos.length !== 1 ? 's' : ''} verfügbar
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeVideos.map((video) => {
          const isPlaying = playingVideo === video.id;
          const hasError = videoErrors.has(video.id);

          return (
            <Card key={video.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-100">
                  {hasError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                      <Play className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Video konnte nicht geladen werden
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryVideo(video)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Erneut versuchen
                      </Button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[video.id] = el;
                        }}
                        src={video.public_url}
                        poster={video.thumbnail_url}
                        muted={muted}
                        playsInline
                        className="w-full h-full object-cover"
                        onError={(e) => handleVideoError(video, e)}
                        onLoadStart={() => console.log('🎥 Video loading started:', video.filename)}
                        onCanPlay={() => console.log('✅ Video can play:', video.filename)}
                      />
                      
                      {/* Video Controls */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2">
                          {isPlaying ? (
                            <Button
                              size="lg"
                              variant="secondary"
                              onClick={() => handleVideoPause(video)}
                            >
                              <Pause className="h-6 w-6" />
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              variant="secondary"
                              onClick={() => handleVideoPlay(video)}
                            >
                              <Play className="h-6 w-6" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setMuted(!muted)}
                          >
                            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Video Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2">
                    {getVideoTitle(video)}
                  </h4>
                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    {video.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default VideoGalleryWithAnalytics;


import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, RefreshCw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminVideos } from '@/hooks/useAdminVideos';
import { useVideoAnalytics } from '@/hooks/useVideoAnalytics';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const HowItWorks = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageMCP();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { 
    videos, 
    loading, 
    error,
    refetch 
  } = useAdminVideos();

  const {
    trackVideoStart,
    trackVideoPause,
    trackVideoCompleted,
    trackVideoError,
    trackThumbnailClick
  } = useVideoAnalytics(selectedVideo);

  // Filter videos for the current language and correct tags
  const featuredVideos = videos.filter(video => {
    const isActive = video.active && video.public;
    const hasRelevantTags = video.tags?.some((tag: string) => 
      ['howto', 'featured', 'whatsgo', 'how-it-works'].includes(tag.toLowerCase())
    );
    
    console.log('🔍 Video filter check:', {
      videoId: video.id,
      filename: video.filename,
      tags: video.tags,
      isActive,
      hasRelevantTags,
      included: isActive && hasRelevantTags
    });
    
    return isActive && hasRelevantTags;
  });

  console.log('📹 HowItWorks video summary:', {
    totalVideos: videos.length,
    featuredVideos: featuredVideos.length,
    currentLanguage,
    loading,
    error: !!error
  });

  const getVideoTitle = (video: any) => {
    switch (currentLanguage) {
      case 'en':
        return video.display_title_en || video.original_name || video.filename;
      case 'ar':
        return video.display_title_ar || video.original_name || video.filename;
      default:
        return video.display_title_de || video.original_name || video.filename;
    }
  };

  const getVideoDescription = (video: any) => {
    switch (currentLanguage) {
      case 'en':
        return video.display_description_en || video.description || '';
      case 'ar':
        return video.display_description_ar || video.description || '';
      default:
        return video.display_description_de || video.description || '';
    }
  };

  const handleVideoClick = (video: any) => {
    if (video.public_url) {
      console.log('🎬 Video selected:', video.filename);
      setSelectedVideo(video);
      trackThumbnailClick();
    }
  };

  const handleVideoPlay = (videoElement: HTMLVideoElement) => {
    setIsPlaying(true);
    trackVideoStart(videoElement);
  };

  const handleVideoPause = (videoElement: HTMLVideoElement) => {
    setIsPlaying(false);
    trackVideoPause(videoElement);
  };

  const handleVideoEnded = (videoElement: HTMLVideoElement) => {
    setIsPlaying(false);
    trackVideoCompleted(videoElement);
  };

  const handleVideoError = (error: any) => {
    console.error('❌ Video error:', error);
    trackVideoError('Video load error', error?.message || 'unknown');
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing videos...');
    refetch();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('common:how_it_works', 'Wie funktioniert es?')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">{t('common:loading', 'Wird geladen...')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('common:how_it_works', 'Wie funktioniert es?')}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t('common:error_loading_content', 'Fehler beim Laden der Inhalte')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {error}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('common:how_it_works', 'Wie funktioniert es?')}
            <div className="flex items-center gap-2">
              {featuredVideos.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {featuredVideos.length} Video{featuredVideos.length !== 1 ? 's' : ''}
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featuredVideos.length === 0 ? (
            <div className="text-center p-8">
              <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('common:no_videos_available', 'Keine Videos verfügbar')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Videos werden in Kürze hinzugefügt.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected Video Player */}
              {selectedVideo && (
                <div className="mb-6">
                  <div className="relative">
                    <video
                      className="w-full rounded-lg shadow-lg"
                      controls
                      onPlay={(e) => handleVideoPlay(e.target as HTMLVideoElement)}
                      onPause={(e) => handleVideoPause(e.target as HTMLVideoElement)}
                      onEnded={(e) => handleVideoEnded(e.target as HTMLVideoElement)}
                      onError={handleVideoError}
                      poster={selectedVideo.thumbnail_url}
                    >
                      <source src={selectedVideo.public_url} type={selectedVideo.mime_type} />
                      {t('common:video_not_supported', 'Ihr Browser unterstützt dieses Video nicht.')}
                    </video>
                    {selectedVideo.tags?.includes('featured') && (
                      <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        {t('common:featured', 'Featured')}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-lg font-semibold">{getVideoTitle(selectedVideo)}</h3>
                    {getVideoDescription(selectedVideo) && (
                      <p className="text-muted-foreground mt-1">{getVideoDescription(selectedVideo)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Video Thumbnails Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredVideos.map((video) => (
                  <div
                    key={video.id}
                    className={`cursor-pointer rounded-lg border transition-all hover:shadow-md ${
                      selectedVideo?.id === video.id 
                        ? 'border-primary shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="relative aspect-video">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={getVideoTitle(video)}
                          className="w-full h-full object-cover rounded-t-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-t-lg flex items-center justify-center">
                          <Play className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      {video.tags?.some((tag: string) => ['featured', 'whatsgo'].includes(tag)) && (
                        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs">
                          {t('common:featured', 'Featured')}
                        </Badge>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-2">{getVideoTitle(video)}</h4>
                      {getVideoDescription(video) && (
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                          {getVideoDescription(video)}
                        </p>
                      )}
                      {video.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {video.tags.slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HowItWorks;

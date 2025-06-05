
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, RefreshCw, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VideoPlayerWithAnalytics from './home/VideoPlayerWithAnalytics';
import { useAdminVideos } from '@/hooks/useAdminVideos';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const HowItWorks = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageMCP();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  const { 
    videos, 
    loading, 
    error,
    refetch 
  } = useAdminVideos();

  // Filter videos for the current language and correct tags
  const featuredVideos = videos.filter(video => {
    const isActive = video.active && video.public;
    const hasRelevantTags = video.tags?.some((tag: string) => 
      ['howto', 'featured', 'whatsgo', 'how-it-works'].includes(tag.toLowerCase())
    );
    
    return isActive && hasRelevantTags;
  });

  // Automatically select first video if none selected
  React.useEffect(() => {
    if (featuredVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(featuredVideos[0]);
    }
  }, [featuredVideos, selectedVideo]);

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
      setSelectedVideo(video);
    }
  };

  const handleRefresh = () => {
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
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('common:how_it_works', 'Wie funktioniert es?')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Entdecken Sie, wie Whatsgonow funktioniert und verbinden Sie sich mit Fahrern in Ihrer Region.
        </p>
      </div>

      {featuredVideos.length === 0 ? (
        <Card>
          <CardContent className="text-center p-12">
            <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('common:no_videos_available', 'Keine Videos verfügbar')}
            </h3>
            <p className="text-muted-foreground">
              Videos werden in Kürze hinzugefügt.
            </p>
            <Button variant="outline" onClick={handleRefresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {selectedVideo && (
                  <div className="aspect-video">
                    <VideoPlayerWithAnalytics
                      video={selectedVideo}
                      src={selectedVideo.public_url}
                      videoId={`howto_${selectedVideo.id}`}
                      component="HowItWorks"
                    />
                  </div>
                )}
              </CardContent>
              {selectedVideo && (
                <CardHeader>
                  <CardTitle className="text-xl">{getVideoTitle(selectedVideo)}</CardTitle>
                  {getVideoDescription(selectedVideo) && (
                    <p className="text-muted-foreground">{getVideoDescription(selectedVideo)}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              )}
            </Card>
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Weitere Videos
                  <Badge variant="outline" className="text-xs">
                    {featuredVideos.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {featuredVideos.map((video, index) => (
                    <div
                      key={video.id}
                      className={`p-4 cursor-pointer transition-colors border-l-4 ${
                        selectedVideo?.id === video.id 
                          ? 'bg-primary/5 border-l-primary' 
                          : 'hover:bg-muted/50 border-l-transparent'
                      }`}
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            {video.thumbnail_url ? (
                              <img
                                src={video.thumbnail_url}
                                alt={getVideoTitle(video)}
                                className="w-full h-full object-cover rounded"
                                loading="lazy"
                              />
                            ) : (
                              <Play className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          {selectedVideo?.id === video.id && (
                            <div className="absolute inset-0 bg-primary/20 rounded flex items-center justify-center">
                              <Play className="h-3 w-3 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {getVideoTitle(video)}
                          </h4>
                          {getVideoDescription(video) && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {getVideoDescription(video)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowItWorks;

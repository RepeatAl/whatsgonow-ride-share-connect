
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  Loader2,
  CheckCircle 
} from "lucide-react";
import VideoGalleryWithAnalytics from "./video/VideoGalleryWithAnalytics";
import HowItWorksCore from "./HowItWorksCore";
import { supabase } from "@/lib/supabaseClient";
import type { AdminVideo } from "@/types/admin";

const HowItWorks = () => {
  const { t, i18n } = useTranslation('landing');
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [systemHealth, setSystemHealth] = useState<'good' | 'warning' | 'error'>('good');
  const currentLanguage = i18n.language;

  const fetchHowItWorksVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('admin_videos')
        .select('*')
        .eq('public', true)
        .eq('active', true)
        .contains('tags', ['howto'])
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('❌ [PUBLIC] Video query failed:', error);
        setSystemHealth('error');
        setError('Videos aktuell nicht verfügbar. Bitte später versuchen.');
        return;
      }

      if (data && data.length > 0) {
        const processedVideos = data
          .filter(video => video && video.id && video.public_url)
          .map(video => ({
            ...video,
            thumbnail_url: video.thumbnail_url || null,
          }));
        
        setVideos(processedVideos);
        setSystemHealth('good');
      } else {
        setSystemHealth('warning');
        setError('Aktuell sind keine Videos verfügbar.');
      }
    } catch (error) {
      console.error('❌ [PUBLIC] Unexpected error fetching videos:', error);
      setSystemHealth('error');
      setError('Unerwarteter Fehler beim Laden der Videos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHowItWorksVideos();
  }, [currentLanguage, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getHealthStatusIcon = () => {
    switch (systemHealth) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Play className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('how_it_works.title', 'Wie funktioniert whatsgonow?')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('how_it_works.description', 'In drei einfachen Schritten zu deinem Transport')}
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Was ist Whatsgonow?
              </h3>
              <div className="flex items-center justify-center gap-2">
                {getHealthStatusIcon()}
                <Badge 
                  variant={systemHealth === 'good' ? 'default' : systemHealth === 'warning' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {systemHealth === 'good' ? 'System OK' : 
                   systemHealth === 'warning' ? 'Warnung' : 'Fehler'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            
            {isLoading && (
              <Card>
                <CardContent className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Videos werden geladen...</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {error && !isLoading && (
              <Card>
                <CardContent className="text-center p-12">
                  <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Video-System Status</h3>
                  <p className="text-lg mb-4 text-gray-600">{error}</p>
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Erneut versuchen
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {!isLoading && !error && videos.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <VideoGalleryWithAnalytics videos={videos} currentLanguage={currentLanguage} />
                </CardContent>
              </Card>
            )}
            
            {!isLoading && !error && videos.length === 0 && (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-center text-gray-600">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Noch keine Videos verfügbar</h3>
                    <p className="text-sm opacity-75">
                      Videos werden in Kürze hinzugefügt.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Steps Grid */}
        <HowItWorksCore />
      </div>
    </section>
  );
};

export default HowItWorks;

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, CheckCircle, Play, RefreshCw } from "lucide-react";
import VideoGallery from "./video/VideoGallery";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import type { AdminVideo } from "@/types/admin";

const HowItWorks = () => {
  const { t, i18n } = useTranslation('landing');
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const currentLanguage = i18n.language;

  const fetchHowItWorksVideos = async () => {
    try {
      console.log('🎥 [PUBLIC] Fetching public howto videos...');
      setIsLoading(true);
      setError(null);
      
      // Query public howto videos
      const { data, error } = await supabase
        .from('admin_videos')
        .select(`
          id, 
          filename,
          original_name,
          file_path,
          file_size,
          mime_type,
          public_url, 
          display_title_de, 
          display_title_en, 
          display_title_ar, 
          display_description_de, 
          display_description_en, 
          display_description_ar, 
          description, 
          tags, 
          active, 
          public, 
          uploaded_at,
          uploaded_by
        `)
        .eq('public', true)
        .eq('active', true)
        .contains('tags', ['howto'])
        .order('uploaded_at', { ascending: false });

      console.log('📊 [PUBLIC] Video query result:', { 
        data, 
        error, 
        queryCount: data?.length || 0,
        errorMessage: error?.message,
        refreshKey
      });

      if (error) {
        console.error('❌ [PUBLIC] Video query failed:', error);
        if (error.code === '42501') {
          setError('Videos sind momentan nicht verfügbar. Dies ist ein bekanntes Problem mit den Datenbankberechtigungen.');
        } else {
          setError('Videos aktuell nicht verfügbar. Bitte später versuchen.');
        }
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ [PUBLIC] Videos found:', {
          count: data.length,
          refreshKey,
          videosWithUrls: data.map(v => ({ 
            id: v.id, 
            hasPublicUrl: !!v.public_url, 
            hasFilePath: !!v.file_path,
            url: v.public_url || v.file_path 
          }))
        });
        
        // Process videos to ensure they have a usable URL (public_url or file_path fallback)
        const processedVideos = data.map(video => ({
          ...video,
          // Use public_url if available, otherwise use file_path as fallback
          public_url: video.public_url || video.file_path || null
        })).filter(video => video.public_url); // Only keep videos with a URL
        
        console.log('🔧 [PUBLIC] Processed videos:', {
          originalCount: data.length,
          processedCount: processedVideos.length,
          filteredOut: data.length - processedVideos.length
        });
        
        if (processedVideos.length === 0) {
          console.warn('⚠️ [PUBLIC] Videos found but no valid URLs');
          setError('Videos sind konfiguriert, aber URLs fehlen. Bitte kontaktieren Sie den Support.');
          return;
        }
        
        setVideos(processedVideos);
        
        console.log('📝 [PUBLIC] Final video list:', {
          totalVideos: processedVideos.length,
          language: currentLanguage,
          videosReady: processedVideos.map(v => ({ 
            id: v.id, 
            url: v.public_url,
            title: v.display_title_de || v.original_name
          })),
          refreshKey
        });
      } else {
        console.log('ℹ️ [PUBLIC] No public howto videos found in database');
        setError('Aktuell sind keine Videos verfügbar.');
      }
    } catch (error) {
      console.error('❌ [PUBLIC] Unexpected error fetching videos:', error);
      setError('Unerwarteter Fehler beim Laden der Videos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHowItWorksVideos();
  }, [currentLanguage, refreshKey]);

  const handleRefresh = () => {
    console.log('🔄 [PUBLIC] Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
  };

  const steps = [
    {
      icon: Upload,
      title: t('how_it_works.step1.title'),
      description: t('how_it_works.step1.description'),
    },
    {
      icon: Users,
      title: t('how_it_works.step2.title'),
      description: t('how_it_works.step2.description'),
    },
    {
      icon: CheckCircle,
      title: t('how_it_works.step3.title'),
      description: t('how_it_works.step3.description'),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('how_it_works.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('how_it_works.description')}
          </p>
        </div>

        {/* Video Gallery Section - NOW WITH ROBUST ERROR HANDLING */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Was ist Whatsgonow?
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="ml-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {isLoading && (
              <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
                  <p className="text-gray-600">Videos werden geladen...</p>
                  <p className="text-xs text-gray-500 mt-2">Refresh #{refreshKey}</p>
                </div>
              </div>
            )}
            
            {error && !isLoading && (
              <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center text-gray-600">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{error}</p>
                  <p className="text-sm mt-2 opacity-75">
                    {error.includes('Datenbankberechtigungen') 
                      ? 'Technisches Problem - wird behoben.'
                      : 'Wir arbeiten daran, die Videos schnellstmöglich wieder verfügbar zu machen.'
                    }
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Erneut versuchen
                  </Button>
                </div>
              </div>
            )}
            
            {!isLoading && !error && videos.length > 0 && (
              <VideoGallery videos={videos} currentLanguage={currentLanguage} />
            )}
            
            {!isLoading && !error && videos.length === 0 && (
              <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center text-gray-600">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Noch keine Videos verfügbar</p>
                  <p className="text-sm mt-2 opacity-75">
                    Videos werden in Kürze hinzugefügt.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-brand-orange rounded-lg flex items-center justify-center mx-auto mb-3">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

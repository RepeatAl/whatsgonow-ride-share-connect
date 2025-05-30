
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
      console.log('🎥 Fetching all howto videos for gallery...');
      setIsLoading(true);
      setError(null);
      
      // Hole alle öffentlichen howto Videos mit allen benötigten Feldern
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

      console.log('📊 Video gallery query result:', { 
        data, 
        error, 
        queryCount: data?.length || 0,
        errorMessage: error?.message,
        refreshKey
      });

      if (error) {
        console.error('❌ Video query failed:', error);
        setError('Videos aktuell nicht verfügbar. Bitte später versuchen.');
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Videos found for gallery:', {
          count: data.length,
          featuredVideos: data.filter(v => v.tags?.includes('featured')).length,
          refreshKey
        });
        
        // Filtere Videos mit gültigen URLs
        const validVideos = data.filter(video => video.public_url);
        
        if (validVideos.length === 0) {
          console.warn('⚠️ Videos found but no valid public URLs');
          setError('Videos aktuell nicht verfügbar. Bitte später versuchen.');
          return;
        }
        
        setVideos(validVideos);
        
        console.log('📝 Using gallery videos:', {
          totalVideos: validVideos.length,
          language: currentLanguage,
          refreshKey
        });
      } else {
        console.log('ℹ️ No public howto videos found');
        setError('Videos aktuell nicht verfügbar. Bitte später versuchen.');
      }
    } catch (error) {
      console.error('❌ Unexpected error fetching videos:', error);
      setError('Videos aktuell nicht verfügbar. Bitte später versuchen.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHowItWorksVideos();
  }, [currentLanguage, refreshKey]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered from HowItWorks');
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

        {/* Video Gallery Sektion */}
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
                    Wir arbeiten daran, die Videos schnellstmöglich wieder verfügbar zu machen.
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
          </div>
        </div>

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

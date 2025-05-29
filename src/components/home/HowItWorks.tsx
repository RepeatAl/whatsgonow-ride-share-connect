
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, CheckCircle, Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { supabase } from "@/lib/supabaseClient";

const HowItWorks = () => {
  const { t, i18n } = useTranslation('landing');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchHowItWorksVideo = async () => {
      try {
        console.log('🎥 Fetching whatsgonow intro video...');
        setIsLoading(true);
        setError(null);
        
        // Optimierte Query für öffentliche Videos mit korrektem Tag
        const { data, error } = await supabase
          .from('admin_videos')
          .select('*')
          .eq('public', true)
          .eq('active', true)
          .contains('tags', ['whatsgonow'])
          .order('uploaded_at', { ascending: false })
          .limit(1);

        console.log('📊 Video query result:', { data, error });

        if (error) {
          console.error('❌ Error fetching video:', error);
          setError(`Video-Abfrage fehlgeschlagen: ${error.message}`);
          return;
        }

        if (data && data.length > 0) {
          const video = data[0];
          console.log('✅ Video found:', video.public_url);
          setVideoUrl(video.public_url);
          
          // Setze den Titel basierend auf der aktuellen Sprache
          const langKey = currentLanguage?.split('-')[0] || 'de';
          const titleKey = `display_title_${langKey}` as keyof typeof video;
          const descKey = `display_description_${langKey}` as keyof typeof video;
          
          setVideoTitle(video[titleKey] as string || video.display_title_en || video.original_name || '');
          setVideoDescription(video[descKey] as string || video.display_description_en || video.description || '');
        } else {
          console.log('ℹ️ No public whatsgonow video found');
          // Keine Fehlermeldung mehr setzen - zeige einfach den Placeholder
        }
      } catch (error) {
        console.error('❌ Unexpected error fetching video:', error);
        setError(`Unerwarteter Fehler: ${(error as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHowItWorksVideo();
  }, [currentLanguage]);

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

        {/* Video-Sektion */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {videoTitle || t('how_it_works.video.title')}
              </h3>
              <p className="text-gray-600">
                {videoDescription || t('how_it_works.video.description')}
              </p>
            </div>
            
            {isLoading && (
              <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
                  <p className="text-gray-600">Video wird geladen...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="aspect-video flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
                <div className="text-center text-red-700">
                  <p className="mb-2">Video konnte nicht geladen werden</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            )}
            
            {!isLoading && !error && videoUrl && (
              <VideoPlayer src={videoUrl} />
            )}
            
            {!isLoading && !error && !videoUrl && (
              <VideoPlayer />
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

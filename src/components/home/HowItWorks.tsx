
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
  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchHowItWorksVideo = async () => {
      try {
        console.log('🎥 Fetching how-it-works video...');
        
        // FIX: Verwende korrekte PostgreSQL Array-Syntax
        const { data, error } = await supabase
          .from('admin_videos')
          .select('*')
          .eq('public', true)
          .contains('tags', ['howto'])
          .order('uploaded_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('❌ Error fetching video:', error);
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
          console.log('ℹ️ No public how-it-works video found');
        }
      } catch (error) {
        console.error('❌ Unexpected error fetching video:', error);
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

        {/* Video-Sektion prominenter anzeigen */}
        {videoUrl && (
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
              <VideoPlayer src={videoUrl} />
            </div>
          </div>
        )}

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

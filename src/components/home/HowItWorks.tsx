
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, CheckCircle, Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { supabase } from "@/lib/supabaseClient";

const HowItWorks = () => {
  const { t } = useTranslation('landing');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchHowItWorksVideo = async () => {
      try {
        console.log('Fetching how-it-works video...');
        
        // Vereinfachte Query ohne 'active' Feld falls es nicht existiert
        const { data, error } = await supabase
          .from('admin_videos')
          .select('public_url, tags')
          .eq('public', true)
          .contains('tags', ['howto'])
          .order('uploaded_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching video:', error);
          return;
        }

        if (data && data.public_url) {
          console.log('Video found:', data.public_url);
          setVideoUrl(data.public_url);
        } else {
          console.log('No public how-it-works video found');
        }
      } catch (error) {
        console.error('Unexpected error fetching video:', error);
      }
    };

    fetchHowItWorksVideo();
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Video Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-brand-orange rounded-lg flex items-center justify-center mx-auto mb-3">
                <Play className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {t('how_it_works.video.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <VideoPlayer src={videoUrl} />
              <p className="text-sm text-gray-600 mt-3 text-center">
                {t('how_it_works.video.description')}
              </p>
            </CardContent>
          </Card>

          {/* Steps Cards */}
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

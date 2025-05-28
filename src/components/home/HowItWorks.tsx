
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Users, CheckCircle } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { supabase } from "@/lib/supabaseClient";

const HowItWorks = () => {
  const { t } = useTranslation('landing');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchHowItWorksVideo = async () => {
      try {
        // Fetch the most recent public video with 'howto' tag
        const { data, error } = await supabase
          .from('admin_videos')
          .select('public_url, tags')
          .eq('public', true)
          .eq('active', true)
          .contains('tags', ['howto'])
          .order('uploaded_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setVideoUrl(data.public_url);
        }
      } catch (error) {
        console.log('No public how-it-works video found');
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-center">
                {t('how_it_works.video.title')}
              </h3>
              <VideoPlayer src={videoUrl} />
              <p className="text-sm text-gray-600 mt-3 text-center">
                {t('how_it_works.video.description')}
              </p>
            </div>
          </div>

          {/* Steps Section */}
          <div className="order-1 lg:order-2 space-y-6">
            {steps.map((step, index) => (
              <Card key={index} className="border-l-4 border-l-brand-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;


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
        console.log('🎥 Fetching howto video for landing page...');
        setIsLoading(true);
        setError(null);
        
        // Strategy 1: Einfache Query ohne Profile-Zugriff
        console.log('📊 Attempting simple video query without profile access...');
        
        let { data, error } = await supabase
          .from('admin_videos')
          .select('id, public_url, display_title_de, display_title_en, display_description_de, display_description_en, original_name, description, tags, active, public, uploaded_at')
          .eq('public', true)
          .eq('active', true)
          .contains('tags', ['howto'])
          .order('uploaded_at', { ascending: false })
          .limit(1);

        // Strategy 2: Fallback mit overlaps
        if (error || !data || data.length === 0) {
          console.log('⚠️ Contains query failed, trying overlaps...', error);
          ({ data, error } = await supabase
            .from('admin_videos')
            .select('id, public_url, display_title_de, display_title_en, display_description_de, display_description_en, original_name, description, tags, active, public, uploaded_at')
            .eq('public', true)
            .eq('active', true)
            .overlaps('tags', ['howto'])
            .order('uploaded_at', { ascending: false })
            .limit(1));
        }

        // Strategy 3: Fallback mit filter
        if (error || !data || data.length === 0) {
          console.log('⚠️ Overlaps query failed, trying filter...', error);
          ({ data, error } = await supabase
            .from('admin_videos')
            .select('id, public_url, display_title_de, display_title_en, display_description_de, display_description_en, original_name, description, tags, active, public, uploaded_at')
            .eq('public', true)
            .eq('active', true)
            .filter('tags', 'cs', '{howto}')
            .order('uploaded_at', { ascending: false })
            .limit(1));
        }

        console.log('📊 Final video query result:', { 
          data, 
          error, 
          queryCount: data?.length || 0,
          errorMessage: error?.message 
        });

        if (error) {
          console.error('❌ All video query strategies failed:', error);
          setError('Video aktuell nicht verfügbar. Bitte später versuchen.');
          return;
        }

        if (data && data.length > 0) {
          const video = data[0];
          console.log('✅ Video found:', {
            id: video.id,
            url: video.public_url,
            title_de: video.display_title_de,
            description_de: video.display_description_de,
            tags: video.tags,
            public: video.public,
            active: video.active
          });
          
          // URL direkt validieren
          if (video.public_url) {
            console.log('🔗 Setting video URL:', video.public_url);
            setVideoUrl(video.public_url);
          } else {
            console.warn('⚠️ Video found but no public_url available');
            setError('Video aktuell nicht verfügbar. Bitte später versuchen.');
            return;
          }
          
          // Admin-Titel und -Beschreibung haben absolute Priorität
          const langKey = currentLanguage?.split('-')[0] || 'de';
          const isGerman = langKey === 'de';
          
          const adminTitle = isGerman 
            ? (video.display_title_de || video.display_title_en || video.original_name || '')
            : (video.display_title_en || video.display_title_de || video.original_name || '');
          
          const adminDescription = isGerman 
            ? (video.display_description_de || video.display_description_en || video.description || '')
            : (video.display_description_en || video.display_description_de || video.description || '');
          
          setVideoTitle(adminTitle);
          setVideoDescription(adminDescription);
          
          console.log('📝 Using admin-provided content:', {
            title: adminTitle,
            description: adminDescription,
            language: langKey,
            isGerman
          });
        } else {
          console.log('ℹ️ No public howto video found');
          setError('Video aktuell nicht verfügbar. Bitte später versuchen.');
        }
      } catch (error) {
        console.error('❌ Unexpected error fetching video:', error);
        setError('Video aktuell nicht verfügbar. Bitte später versuchen.');
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

        {/* Video-Sektion mit robuster Admin-Feld-Priorisierung */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {videoTitle || "Was ist Whatsgonow?"}
              </h3>
              <p className="text-gray-600">
                {videoDescription || "Erfahre in diesem Video alles über whatsgonow und wie wir Crowdlogistik revolutionieren"}
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
            
            {error && !isLoading && (
              <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center text-gray-600">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{error}</p>
                  <p className="text-sm mt-2 opacity-75">
                    Wir arbeiten daran, das Video schnellstmöglich wieder verfügbar zu machen.
                  </p>
                </div>
              </div>
            )}
            
            {!isLoading && !error && videoUrl && (
              <VideoPlayer src={videoUrl} />
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

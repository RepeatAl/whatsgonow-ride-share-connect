
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, MapPin, Settings } from "lucide-react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import VideoPlayer from "./VideoPlayer";
import VideoUploadDialog from "../admin/VideoUploadDialog";

const HowItWorks = () => {
  const { t } = useTranslation('landing');
  const { profile } = useSimpleAuth();
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Nur Admin/Community Manager können Videos hochladen
  const canUploadVideo = profile?.role === 'admin' || profile?.role === 'community_manager';

  const steps = [
    {
      icon: <Users className="h-12 w-12 text-brand-primary" />,
      title: t('how_it_works.step1.title'),
      description: t('how_it_works.step1.description'),
    },
    {
      icon: <MapPin className="h-12 w-12 text-brand-primary" />,
      title: t('how_it_works.step2.title'),
      description: t('how_it_works.step2.description'),
    },
    {
      icon: <ArrowRight className="h-12 w-12 text-brand-primary" />,
      title: t('how_it_works.step3.title'),
      description: t('how_it_works.step3.description'),
    },
  ];

  const handleVideoUploaded = (url: string) => {
    setVideoUrl(url);
    // TODO: Save video URL to database/configuration
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('how_it_works.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('how_it_works.description')}
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('how_it_works.video.title')}
                </h3>
                {canUploadVideo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVideoUpload(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Video verwalten
                  </Button>
                )}
              </div>
              <p className="text-gray-600">
                {t('how_it_works.video.description')}
              </p>
            </div>
            
            <div className="shadow-2xl rounded-lg overflow-hidden">
              <VideoPlayer src={videoUrl} />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-6 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                  <div className="mt-6 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-brand-primary text-white rounded-full font-bold">
                      {index + 1}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Video Upload Dialog - Nur für Admins */}
        {canUploadVideo && (
          <VideoUploadDialog
            open={showVideoUpload}
            onOpenChange={setShowVideoUpload}
            onVideoUploaded={handleVideoUploaded}
          />
        )}
      </div>
    </section>
  );
};

export default HowItWorks;

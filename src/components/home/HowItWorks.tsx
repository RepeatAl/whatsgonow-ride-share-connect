
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, MapPin, Settings } from "lucide-react";
import { useSimpleAuth } from "@/contexts/SimpleAuthContext";
import VideoPlayer from "./VideoPlayer";
import EnhancedVideoUploadDialog from "../admin/EnhancedVideoUploadDialog";

const HowItWorks = () => {
  const { t, ready } = useTranslation('landing');
  const { profile } = useSimpleAuth();
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Nur Admin/Community Manager können Videos hochladen
  const canUploadVideo = profile?.role === 'admin' || profile?.role === 'community_manager';

  // Fallback-Funktion für fehlende Übersetzungen
  const getTranslation = (key: string, fallback: string) => {
    const translation = t(key, fallback);
    if (translation === key && process.env.NODE_ENV === 'development') {
      console.warn(`[HowItWorks] Missing translation key: ${key}`);
    }
    return translation;
  };

  const steps = [
    {
      icon: <Users className="h-12 w-12 text-brand-primary" />,
      title: getTranslation('how_it_works.step1.title', 'Gegenstand einstellen'),
      description: getTranslation('how_it_works.step1.description', 'Lade Details und Fotos deines Gegenstands hoch'),
    },
    {
      icon: <MapPin className="h-12 w-12 text-brand-primary" />,
      title: getTranslation('how_it_works.step2.title', 'Fahrer finden'),
      description: getTranslation('how_it_works.step2.description', 'Wir verbinden dich mit Fahrern in deiner Nähe'),
    },
    {
      icon: <ArrowRight className="h-12 w-12 text-brand-primary" />,
      title: getTranslation('how_it_works.step3.title', 'Sicher transportieren'),
      description: getTranslation('how_it_works.step3.description', 'Dein Gegenstand wird sicher und schnell geliefert'),
    },
  ];

  const handleVideoUploaded = (url: string) => {
    setVideoUrl(url);
    // TODO: Save video URL to database/configuration
  };

  if (!ready) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-6" />
                  <div className="h-6 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getTranslation('how_it_works.title', 'So funktioniert\'s')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {getTranslation('how_it_works.description', 'Eine einfache 3-Schritte-Anleitung für den optimalen Transport')}
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {getTranslation('how_it_works.video.title', 'Video-Anleitung')}
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
                {getTranslation('how_it_works.video.description', 'In diesem Video siehst du alle Schritte im Überblick')}
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
        
        {/* Enhanced Video Upload Dialog - Nur für Admins */}
        {canUploadVideo && (
          <EnhancedVideoUploadDialog
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

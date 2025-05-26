
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Users, ArrowRight, MapPin } from "lucide-react";

const HowItWorks = () => {
  const { t } = useTranslation('landing');

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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('how_it_works.video.title')}
              </h3>
              <p className="text-gray-600">
                {t('how_it_works.video.description')}
              </p>
            </div>
            
            <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
              {/* Video Placeholder - Replace with actual video when available */}
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-brand-primary to-brand-orange">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    Video wird bald verfügbar sein
                  </p>
                  <p className="text-sm opacity-80 mt-2">
                    Hier wird das Erklärvideo zu whatsgonow eingebettet
                  </p>
                </div>
              </div>
              
              {/* Overlay for future video */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  <Play className="h-5 w-5 mr-2" />
                  Video abspielen
                </Button>
              </div>
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
      </div>
    </section>
  );
};

export default HowItWorks;

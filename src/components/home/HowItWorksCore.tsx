
import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, CheckCircle } from "lucide-react";

const HowItWorksCore = () => {
  const { t } = useTranslation('landing');

  const steps = [
    {
      icon: Upload,
      title: t('how_it_works.step1.title', 'Transport erstellen'),
      description: t('how_it_works.step1.description', 'Erstelle deinen Transportauftrag mit wenigen Klicks'),
    },
    {
      icon: Users,
      title: t('how_it_works.step2.title', 'Fahrer finden'),
      description: t('how_it_works.step2.description', 'Finde vertrauensvolle Fahrer in deiner Nähe'),
    },
    {
      icon: CheckCircle,
      title: t('how_it_works.step3.title', 'Transport abschließen'),
      description: t('how_it_works.step3.description', 'Sichere Abwicklung und Bewertung'),
    },
  ];

  return (
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
  );
};

export default HowItWorksCore;

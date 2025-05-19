
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, Search, FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation('landing');

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{t('how_it_works.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            {t('how_it_works.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            icon={<Package className="h-10 w-10 text-brand-orange" />}
            title={t('how_it_works.step1.title')}
            description={t('how_it_works.step1.description')}
            step={1}
          />
          
          <StepCard 
            icon={<Search className="h-10 w-10 text-brand-orange" />}
            title={t('how_it_works.step2.title')}
            description={t('how_it_works.step2.description')}
            step={2}
          />
          
          <StepCard 
            icon={<FileCheck className="h-10 w-10 text-brand-orange" />}
            title={t('how_it_works.step3.title')}
            description={t('how_it_works.step3.description')}
            step={3}
          />
          
          <StepCard 
            icon={<Truck className="h-10 w-10 text-brand-orange" />}
            title={t('how_it_works.step4.title')}
            description={t('how_it_works.step4.description')}
            step={4}
          />
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

const StepCard = ({ icon, title, description, step }: StepCardProps) => {
  return (
    <Card className="relative border-none shadow-md hover:shadow-lg transition-shadow">
      <div className="absolute -top-4 -left-4 bg-brand-orange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
        {step}
      </div>
      <CardHeader className="flex flex-col items-center pb-2">
        <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default HowItWorks;

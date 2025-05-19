
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Users
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Benefits = () => {
  const { t } = useTranslation('landing');
  
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold">{t('benefits.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          {t('benefits.description')}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BenefitCard 
          icon={<Clock className="h-6 w-6 text-brand-orange" />}
          title={t('landing.benefits.time_saving.title')}
          description={t('landing.benefits.time_saving.description')}
        />
        
        <BenefitCard 
          icon={<DollarSign className="h-6 w-6 text-brand-orange" />}
          title={t('landing.benefits.cost_saving.title')}
          description={t('landing.benefits.cost_saving.description')}
        />
        
        <BenefitCard 
          icon={<Leaf className="h-6 w-6 text-brand-orange" />}
          title={t('landing.benefits.environmentally_friendly.title')}
          description={t('landing.benefits.environmentally_friendly.description')}
        />
        
        <BenefitCard 
          icon={<ShieldCheck className="h-6 w-6 text-brand-orange" />}
          title={t('landing.benefits.security.title')}
          description={t('landing.benefits.security.description')}
        />
        
        <BenefitCard 
          icon={<TrendingUp className="h-6 w-6 text-brand-orange" />}
          title={t('landing.benefits.flexibility.title')}
          description={t('landing.benefits.flexibility.description')}
        />
        
        <BenefitCard 
          icon={<Users className="h-6 w-6 text-brand-orange" />}
          title={t('landing.benefits.community.title')}
          description={t('landing.benefits.community.description')}
        />
      </div>
    </section>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <Card className="border-none shadow hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-2">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Benefits;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Package, Truck, Building, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const UserGroups = () => {
  const { t, i18n } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';
  
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{t('user_groups.title', 'Für wen ist whatsgonow?')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            {t('user_groups.description', 'Unsere Plattform verbindet verschiedene Nutzergruppen für effiziente Transporte')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <UserGroupCard 
            icon={<Package className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.private.title', 'Private Sender')}
            description={t('user_groups.private.description', 'Versende Gegenstände günstig und umweltfreundlich')}
            learnMoreText={t('user_groups.private.learn_more', 'Mehr erfahren')}
            earlyAccessText={t('user_groups.private.early_access', 'Early Access')}
            role="private"
          />
          
          <UserGroupCard 
            icon={<Building className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.business.title', 'Geschäftskunden')}
            description={t('user_groups.business.description', 'Flexible Logistiklösungen für dein Unternehmen')}
            learnMoreText={t('user_groups.business.learn_more', 'Mehr erfahren')}
            earlyAccessText={t('user_groups.business.early_access', 'Early Access')}
            role="business"
          />
          
          <UserGroupCard 
            icon={<Truck className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.driver.title', 'Fahrer')}
            description={t('user_groups.driver.description', 'Verdiene Geld mit deinen geplanten Fahrten')}
            learnMoreText={t('user_groups.driver.learn_more', 'Mehr erfahren')}
            earlyAccessText={t('user_groups.driver.early_access', 'Early Access')}
            role="driver"
          />

          <UserGroupCard 
            icon={<Users className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.cm.title', 'Community Manager')}
            description={t('user_groups.cm.description', 'Unterstütze whatsgonow in deiner Region')}
            learnMoreText={t('user_groups.cm.learn_more', 'Mehr erfahren')}
            earlyAccessText={t('user_groups.cm.early_access', 'Early Access')}
            role="cm"
          />
        </div>
      </div>
    </section>
  );
};

interface UserGroupCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  learnMoreText: string;
  earlyAccessText: string;
  role: string;
}

const UserGroupCard = ({ icon, title, description, learnMoreText, earlyAccessText, role }: UserGroupCardProps) => {
  const { getLocalizedUrl } = useLanguageMCP();
  
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex flex-col items-center pb-2">
        <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-center text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link to={getLocalizedUrl(`/about?section=${role}`)}>{learnMoreText}</Link>
        </Button>
        <Button asChild className="w-full bg-brand-orange hover:bg-brand-orange/90">
          <Link to={getLocalizedUrl(`/pre-register?role=${role}`)}>{earlyAccessText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserGroups;


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
          <h2 className="text-3xl font-bold">{t('user_groups.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            {t('user_groups.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <UserGroupCard 
            icon={<Package className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.private.title')}
            description={t('user_groups.private.description')}
            learnMoreText={t('user_groups.private.learn_more')}
            preRegisterText={t('user_groups.private.pre_register')}
            role="private"
          />
          
          <UserGroupCard 
            icon={<Building className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.business.title')}
            description={t('user_groups.business.description')}
            learnMoreText={t('user_groups.business.learn_more')}
            preRegisterText={t('user_groups.business.pre_register')}
            role="business"
          />
          
          <UserGroupCard 
            icon={<Truck className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.driver.title')}
            description={t('user_groups.driver.description')}
            learnMoreText={t('user_groups.driver.learn_more')}
            preRegisterText={t('user_groups.driver.pre_register')}
            role="driver"
          />

          <UserGroupCard 
            icon={<Users className="h-10 w-10 text-brand-orange" />}
            title={t('user_groups.cm.title')}
            description={t('user_groups.cm.description')}
            learnMoreText={t('user_groups.cm.learn_more')}
            preRegisterText={t('user_groups.cm.pre_register')}
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
  preRegisterText: string;
  role: string;
}

const UserGroupCard = ({ icon, title, description, learnMoreText, preRegisterText, role }: UserGroupCardProps) => {
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
        <Button asChild variant="ghost" size="sm" className="w-full">
          <Link to={getLocalizedUrl(`/pre-register?role=${role}`)}>{preRegisterText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserGroups;

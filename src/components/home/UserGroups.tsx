
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Package, Truck, Building, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const UserGroups = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">{t('landing.user_groups.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            {t('landing.user_groups.description')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <UserGroupCard 
            icon={<Package className="h-10 w-10 text-brand-orange" />}
            title={t('landing.user_groups.private.title')}
            description={t('landing.user_groups.private.description')}
            buttonText={t('landing.user_groups.private.button')}
          />
          
          <UserGroupCard 
            icon={<Building className="h-10 w-10 text-brand-orange" />}
            title={t('landing.user_groups.business.title')}
            description={t('landing.user_groups.business.description')}
            buttonText={t('landing.user_groups.business.button')}
          />
          
          <UserGroupCard 
            icon={<Truck className="h-10 w-10 text-brand-orange" />}
            title={t('landing.user_groups.driver.title')}
            description={t('landing.user_groups.driver.description')}
            buttonText={t('landing.user_groups.driver.button')}
          />

          <UserGroupCard 
            icon={<Users className="h-10 w-10 text-brand-orange" />}
            title={t('landing.user_groups.cm.title')}
            description={t('landing.user_groups.cm.description')}
            buttonText={t('landing.user_groups.cm.button')}
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
  buttonText: string;
}

const UserGroupCard = ({ icon, title, description, buttonText }: UserGroupCardProps) => {
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
      <CardFooter className="pt-4 flex justify-center">
        <Button asChild variant="outline">
          <Link to="/register">{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserGroups;

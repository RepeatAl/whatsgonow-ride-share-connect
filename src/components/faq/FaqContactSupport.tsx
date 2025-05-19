
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const FaqContactSupport = () => {
  const { t } = useTranslation('faq');
  
  return (
    <div className="mt-12 p-6 bg-muted rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-4">{t('contact_support.title')}</h2>
      <p className="text-muted-foreground mb-6">
        {t('contact_support.description')}
      </p>
      <Button asChild>
        <Link to="/support">{t('contact_support.button')}</Link>
      </Button>
    </div>
  );
};

export default FaqContactSupport;

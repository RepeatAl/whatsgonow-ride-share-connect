
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CTA = () => {
  const { t, i18n } = useTranslation('landing');
  const isRTL = i18n.language === 'ar';
  
  return (
    <section className="py-16 bg-brand-orange text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t('cta.title')}
        </h2>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {t('cta.description')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="default" className="bg-white text-brand-orange hover:bg-gray-100">
            <Link to="/register">{t('cta.button_primary')}</Link>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to="/faq">{t('cta.button_secondary')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;

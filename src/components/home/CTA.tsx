
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const CTA = () => {
  const { t, i18n, ready } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';
  
  if (!ready) {
    return null;
  }
  
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
          <Button 
            asChild 
            size="lg" 
            variant="default" 
            className="bg-white text-brand-orange hover:bg-gray-100"
            style={{ zIndex: 10, position: 'relative' }}
            onClick={() => console.log('CTA Login button clicked')}
          >
            <Link 
              to={getLocalizedUrl("/login")}
              onClick={(e) => {
                console.log('CTA Login link clicked:', getLocalizedUrl("/login"));
                console.log('Event:', e);
              }}
            >
              {t('cta.button_login')}
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
            style={{ zIndex: 10, position: 'relative' }}
            onClick={() => console.log('CTA Register button clicked')}
          >
            <Link 
              to={getLocalizedUrl("/register")}
              onClick={(e) => {
                console.log('CTA Register link clicked:', getLocalizedUrl("/register"));
                console.log('Event:', e);
              }}
            >
              {t('cta.button_register')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Hero = () => {
  const { t, i18n, ready } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Title */}
          <h1 
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6" 
            dangerouslySetInnerHTML={{
              __html: t('hero.title', 'Teile deine Fahrt, <span class="text-brand-orange">verbinde</span> Menschen')
            }} 
          />
          
          {/* Hero Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle', 'Nachhaltiger Transport durch intelligente Vermittlung zwischen Fahrern und Sendern')}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              <Link to={getLocalizedUrl("/about")}>
                {t('hero.cta_learn_more', 'Mehr erfahren')}
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200">
              <Link to={getLocalizedUrl("/pre-register")}>
                {t('hero.cta_early_access', 'Early Access sichern')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

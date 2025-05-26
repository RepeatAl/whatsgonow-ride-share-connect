
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import SystemCheck from "@/components/debug/SystemCheck";

const Hero = () => {
  const { t, i18n, ready } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const isRTL = i18n.language === 'ar';
  
  console.log('[HERO-DEBUG] Landing namespace loaded:', ready);
  console.log('[HERO-DEBUG] Current language:', i18n.language);
  console.log('[HERO-DEBUG] Translation ready:', ready);
  console.log('[HERO-DEBUG] Hero title translation:', t('hero.title'));
  
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-orange"></div>
      </div>
    );
  }
  
  return (
    <>
      {/* Debug Panel - nur in Development Mode sichtbar */}
      {process.env.NODE_ENV === 'development' && <SystemCheck />}
      
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
            
            {/* CTA Buttons with enhanced debugging */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ zIndex: 10, position: 'relative' }}
                onClick={() => console.log('Hero CTA button clicked')}
              >
                <Link 
                  to={getLocalizedUrl("/about")} 
                  className="block w-full h-full"
                  onClick={(e) => {
                    console.log('Link clicked:', getLocalizedUrl("/about"));
                    console.log('Event:', e);
                  }}
                >
                  {t('hero.cta_learn_more', 'Mehr erfahren')}
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200"
                style={{ zIndex: 10, position: 'relative' }}
                onClick={() => console.log('Pre-register button clicked')}
              >
                <Link 
                  to={getLocalizedUrl("/pre-register")}
                  className="block w-full h-full"
                  onClick={(e) => {
                    console.log('Pre-register link clicked:', getLocalizedUrl("/pre-register"));
                    console.log('Event:', e);
                  }}
                >
                  {t('hero.cta_preregister', 'Vorab registrieren')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

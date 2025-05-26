
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
import { useState } from "react";
import { ConnectionError } from "@/components/ui/connection-error";

const CTA = () => {
  const { t, i18n, ready } = useTranslation('landing');
  const { getLocalizedUrl } = useLanguageMCP();
  const [showConnectionError, setShowConnectionError] = useState(false);
  const isRTL = i18n.language === 'ar';
  
  if (!ready) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    // Check if we're offline or if there are connection issues
    if (!navigator.onLine) {
      e.preventDefault();
      setShowConnectionError(true);
      return;
    }
  };

  const handleRetry = () => {
    setShowConnectionError(false);
  };
  
  if (showConnectionError) {
    return (
      <section className="py-16 bg-brand-orange text-white" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          <ConnectionError 
            message="Keine Internetverbindung. Bitte überprüfe deine Verbindung und versuche es erneut."
            onRetry={handleRetry}
          />
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 bg-brand-orange text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t('cta.title', 'Sei dabei, wenn whatsgonow startet!')}
        </h2>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {t('cta.description', 'Melde dich jetzt für den Early Access an und sei einer der Ersten.')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            asChild 
            size="lg" 
            variant="default" 
            className="bg-white text-brand-orange hover:bg-gray-100"
          >
            <Link 
              to={getLocalizedUrl("/login")}
              onClick={handleLinkClick}
            >
              {t('cta.button_login', 'Anmelden')}
            </Link>
          </Button>
          
          <Button 
            asChild 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
          >
            <Link 
              to={getLocalizedUrl("/pre-register")}
              onClick={handleLinkClick}
            >
              {t('cta.button_register', 'Jetzt dabei sein')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;

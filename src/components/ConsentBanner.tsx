
import React, { useState, useEffect } from 'react';
import { X, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

const CONSENT_KEY = 'whatsgonow-gdpr-consent';
const CONSENT_DATE_KEY = 'whatsgonow-gdpr-date';

export const ConsentBanner = () => {
  const { t } = useTranslation(['common', 'landing']);
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem(CONSENT_KEY);
    const consentDate = localStorage.getItem(CONSENT_DATE_KEY);
    
    // Show banner if no consent given or consent older than 1 year
    if (!consentStatus || consentStatus !== 'accepted') {
      setShowBanner(true);
      setIsVisible(true);
    } else if (consentDate) {
      const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
      if (new Date(consentDate).getTime() < oneYearAgo) {
        setShowBanner(true);
        setIsVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <Card className="max-w-4xl mx-auto border-orange-200 bg-white/95 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t('landing:gdpr.title', 'Datenschutz & Cookies')}
                </h3>
                <p className="text-gray-700 text-sm">
                  {t('landing:gdpr.message', 
                    'Wir nutzen Cookies und verarbeiten personenbezogene Daten, um dir die bestmögliche Nutzererfahrung zu bieten. Durch die Nutzung unserer Website stimmst du unserer Datenschutzerklärung zu.'
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="text-xs text-gray-600">
                  {t('landing:gdpr.privacy', 'Weitere Informationen in unserer')}{' '}
                  <a href="/privacy" className="underline text-orange-600 hover:text-orange-700">
                    {t('common:privacy_policy', 'Datenschutzerklärung')}
                  </a>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleDecline}
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    {t('landing:gdpr.decline', 'Ablehnen')}
                  </Button>
                  <Button 
                    onClick={handleAccept}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {t('landing:gdpr.accept', 'Akzeptieren')}
                  </Button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)} 
              className="p-1 hover:bg-gray-100 rounded-full flex-shrink-0"
              aria-label="Banner schließen"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentBanner;

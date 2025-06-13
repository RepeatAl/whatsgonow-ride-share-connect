
// 🚨 CRITICAL GDPR BANNER - Global consent management (Stand: 13.06.2025)

import React, { useState, useEffect } from 'react';
import { X, Shield, Info, MapPin, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

const CONSENT_KEY = 'whatsgonow-gdpr-consent';
const CONSENT_DATE_KEY = 'whatsgonow-gdpr-date';

interface ConsentSettings {
  essential: boolean;
  analytics: boolean;
  map: boolean;
}

export const ConsentBanner = () => {
  const { t } = useTranslation(['common', 'landing']);
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    essential: true, // Always required
    analytics: false,
    map: false
  });

  useEffect(() => {
    const consentStatus = localStorage.getItem(CONSENT_KEY);
    const consentDate = localStorage.getItem(CONSENT_DATE_KEY);
    
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

  const handleAcceptAll = () => {
    const allConsent = { essential: true, analytics: true, map: true };
    saveConsent(allConsent);
  };

  const handleAcceptSelected = () => {
    saveConsent(consentSettings);
  };

  const handleDeclineAll = () => {
    const minimalConsent = { essential: true, analytics: false, map: false };
    saveConsent(minimalConsent);
  };

  const saveConsent = (settings: ConsentSettings) => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    localStorage.setItem('whatsgonow-consent-settings', JSON.stringify(settings));
    
    console.log('🛡️ GDPR Consent saved:', settings);
    
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
          {!showDetails ? (
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
                      'Wir nutzen Cookies und externe Dienste für eine bessere Nutzererfahrung. Sie können Ihre Präferenzen jederzeit anpassen.'
                    )}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="text-xs text-gray-600">
                    {t('landing:gdpr.privacy', 'Weitere Informationen in unserer')}{' '}
                    <a href="/privacy-policy" className="underline text-orange-600 hover:text-orange-700">
                      {t('common:privacy_policy', 'Datenschutzerklärung')}
                    </a>
                    {' und dem '}
                    <a href="/impressum" className="underline text-orange-600 hover:text-orange-700">
                      {t('common:impressum', 'Impressum')}
                    </a>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowDetails(true)}
                      variant="outline" 
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      {t('landing:gdpr.customize', 'Anpassen')}
                    </Button>
                    <Button 
                      onClick={handleDeclineAll}
                      variant="outline" 
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      {t('landing:gdpr.decline', 'Nur Notwendige')}
                    </Button>
                    <Button 
                      onClick={handleAcceptAll}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {t('landing:gdpr.accept', 'Alle akzeptieren')}
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
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('landing:gdpr.customize_title', 'Datenschutz-Einstellungen')}
                </h3>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <Tabs defaultValue="essential" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="essential" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('landing:gdpr.essential', 'Notwendig')}
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <Cookie className="h-4 w-4" />
                    {t('landing:gdpr.analytics', 'Analyse')}
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('landing:gdpr.map', 'Karten')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="essential" className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium">Notwendige Cookies</h4>
                      <p className="text-sm text-gray-600">Für grundlegende Funktionen erforderlich</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">Immer aktiv</div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium">Analyse & Performance</h4>
                      <p className="text-sm text-gray-600">Hilft uns die Website zu verbessern</p>
                    </div>
                    <Button
                      variant={consentSettings.analytics ? "default" : "outline"}
                      size="sm"
                      onClick={() => setConsentSettings(prev => ({ ...prev, analytics: !prev.analytics }))}
                    >
                      {consentSettings.analytics ? 'Ein' : 'Aus'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="map" className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h4 className="font-medium">HERE Maps Kartendienst</h4>
                      <p className="text-sm text-gray-600">Externe Karten (IP-Übertragung an HERE)</p>
                    </div>
                    <Button
                      variant={consentSettings.map ? "default" : "outline"}
                      size="sm"
                      onClick={() => setConsentSettings(prev => ({ ...prev, map: !prev.map }))}
                    >
                      {consentSettings.map ? 'Ein' : 'Aus'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAcceptSelected}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {t('landing:gdpr.save_settings', 'Einstellungen speichern')}
                </Button>
                <Button 
                  onClick={handleDeclineAll}
                  variant="outline"
                >
                  {t('landing:gdpr.decline', 'Nur Notwendige')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentBanner;

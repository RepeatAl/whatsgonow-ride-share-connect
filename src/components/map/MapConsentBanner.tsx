
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Shield, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MapConsentBannerProps {
  onConsent: (accepted: boolean) => void;
}

export function MapConsentBanner({ onConsent }: MapConsentBannerProps) {
  const { t } = useTranslation(['landing', 'common']);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('whatsgonow-map-consent');
    if (!consent) {
      setVisible(true);
    } else if (consent === 'accepted') {
      onConsent(true);
    }
  }, [onConsent]);

  const handleAccept = () => {
    localStorage.setItem('whatsgonow-map-consent', 'accepted');
    localStorage.setItem('whatsgonow-map-consent-date', new Date().toISOString());
    setVisible(false);
    onConsent(true);
  };

  const handleDecline = () => {
    localStorage.setItem('whatsgonow-map-consent', 'declined');
    localStorage.setItem('whatsgonow-map-consent-date', new Date().toISOString());
    setVisible(false);
    onConsent(false);
  };

  if (!visible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <Card className="border-orange-200 bg-orange-50/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('landing:mapConsent.title', 'Kartendienst & Datenschutz')}
                </h3>
                <p className="text-orange-800 mb-3">
                  {t('landing:mapConsent.message', 
                    'Diese Karte nutzt den externen Dienst HERE Maps. Beim Laden der Karte wird Ihre IP-Adresse an HERE übertragen. Bitte bestätigen Sie Ihre Zustimmung.'
                  )}
                </p>
                
                <div className="bg-orange-100 p-3 rounded border border-orange-200 text-sm text-orange-700">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">
                        {t('landing:mapConsent.dataProcessing', 'Datenverarbeitung:')}
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>• {t('landing:mapConsent.ipAddress', 'IP-Adresse wird an HERE Global B.V. übertragen')}</li>
                        <li>• {t('landing:mapConsent.location', 'Ungefähre Standortermittlung für Kartendarstellung')}</li>
                        <li>• {t('landing:mapConsent.noStorage', 'Keine Speicherung von persönlichen Daten auf unseren Servern')}</li>
                        <li>• {t('landing:mapConsent.revocable', 'Zustimmung jederzeit widerrufbar')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAccept}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {t('landing:mapConsent.accept', 'Karte anzeigen')}
                </Button>
                <Button 
                  onClick={handleDecline}
                  variant="outline" 
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  {t('landing:mapConsent.decline', 'Ablehnen')}
                </Button>
              </div>
              
              <p className="text-xs text-orange-600">
                {t('landing:mapConsent.privacy', 
                  'Weitere Informationen finden Sie in unserer'
                )}{' '}
                <a href="/privacy" className="underline hover:no-underline">
                  {t('common:privacy_policy', 'Datenschutzerklärung')}
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MapPin, Eye, Clock, Globe, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MapPolicy() {
  const { t } = useTranslation(['landing', 'common']);

  const clearMapConsent = () => {
    localStorage.removeItem('whatsgonow-map-consent');
    localStorage.removeItem('whatsgonow-map-consent-date');
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-blue-600" />
            {t('landing:mapPolicy.title', 'HERE Maps Datenschutz & Nutzung')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Was ist HERE Maps */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              {t('landing:mapPolicy.whatIs.title', 'Was ist HERE Maps?')}
            </h3>
            <p className="text-gray-700">
              {t('landing:mapPolicy.whatIs.description', 
                'HERE Maps ist ein professioneller Kartendienst der HERE Global B.V. (Niederlande). Wir nutzen diesen Service, um Ihnen eine interaktive Karte mit Transportangeboten anzuzeigen.'
              )}
            </p>
          </div>

          {/* Welche Daten werden übertragen */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-600" />
              {t('landing:mapPolicy.dataTransfer.title', 'Welche Daten werden übertragen?')}
            </h3>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.dataTransfer.ip', 'Ihre IP-Adresse (automatisch bei jedem Internet-Zugriff)')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.dataTransfer.location', 'Ungefähre Standortinformationen (abgeleitet aus IP-Adresse)')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.dataTransfer.browser', 'Browser-Informationen (User-Agent, Bildschirmauflösung)')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.dataTransfer.interaction', 'Karten-Interaktionen (Zoom, Verschieben, Klicks)')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Was passiert NICHT */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              {t('landing:mapPolicy.noData.title', 'Was passiert NICHT?')}
            </h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.noData.personal', 'Keine Übertragung von Namen, E-Mail oder Account-Daten')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.noData.storage', 'Keine dauerhafte Speicherung auf unseren Servern')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.noData.tracking', 'Kein Cross-Site-Tracking oder Profiling')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <span>{t('landing:mapPolicy.noData.selling', 'Keine Weitergabe an Werbetreibende')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Rechtsgrundlage */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              {t('landing:mapPolicy.legal.title', 'Rechtsgrundlage')}
            </h3>
            <p className="text-gray-700 text-sm">
              {t('landing:mapPolicy.legal.description', 
                'Die Nutzung von HERE Maps erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese Einwilligung jederzeit widerrufen.'
              )}
            </p>
          </div>

          {/* Widerruf */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              {t('landing:mapPolicy.revoke.title', 'Einwilligung widerrufen')}
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              {t('landing:mapPolicy.revoke.description', 
                'Sie können Ihre Einwilligung zur Nutzung von HERE Maps jederzeit widerrufen:'
              )}
            </p>
            <button 
              onClick={clearMapConsent}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              {t('landing:mapPolicy.revoke.button', 'Einwilligung widerrufen')}
            </button>
            <p className="text-xs text-gray-500">
              {t('landing:mapPolicy.revoke.effect', 
                'Nach dem Widerruf wird die Karte nicht mehr geladen und Sie werden erneut nach Ihrer Einwilligung gefragt.'
              )}
            </p>
          </div>

          {/* HERE Datenschutz */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">
              {t('landing:mapPolicy.herePrivacy.title', 'HERE Maps Datenschutzerklärung')}
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              {t('landing:mapPolicy.herePrivacy.description', 
                'Weitere Informationen zur Datenverarbeitung durch HERE finden Sie in deren Datenschutzerklärung:'
              )}
            </p>
            <a 
              href="https://legal.here.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              https://legal.here.com/privacy
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

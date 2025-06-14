
// 🚨 LOCKED: DSGVO MAP CONSENT. Do not change the loading or consent logic without CTO approval!
// 🚨 LOCKED FILE – Do not edit without explicit CTO approval! (Stand: 13.06.2025)
// 🚨 CRITICAL FIX: Strikte Conditional Imports - Map nur nach explizitem Button-Click!

import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, Info } from "lucide-react";
import { MapConsentBanner } from "@/components/map/MapConsentBanner";
import { useMapConsent } from "@/hooks/useMapConsent";

// CRITICAL FIX: Conditional Dynamic Import nur nach Consent
const LazyHereMap = React.lazy(() => import("@/components/map/StableHereMapWithData"));

const LiveMapSection = () => {
  const { t } = useTranslation(['landing']);
  const { 
    showBanner, 
    isMapAllowed, 
    acceptConsent, 
    declineConsent, 
    revokeConsent,
    consentState 
  } = useMapConsent();

  const MapFallbackContent = () => (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-blue-900">
            {t('landing:mapFallback.title', 'Datenschutz respektiert')}
          </h3>
          <p className="text-blue-800">
            {consentState === false 
              ? t('landing:mapFallback.message', 'Sie haben der Nutzung von HERE Maps nicht zugestimmt. Ihre Privatsphäre ist uns wichtig.')
              : t('landing:mapFallback.loading', 'Kartenansicht wird nach Ihrer Zustimmung geladen.')
            }
          </p>
          <div className="bg-blue-100 p-4 rounded-lg text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium mb-2">
                  {t('landing:mapFallback.alternative.title', 'Alternative ohne externe Karte:')}
                </p>
                <ul className="space-y-1 text-xs">
                  <li>• {t('landing:mapFallback.alternative.search', 'Nutzen Sie unsere Suchfunktion für Transporte')}</li>
                  <li>• {t('landing:mapFallback.alternative.list', 'Durchsuchen Sie aktuelle Angebote in der Listenansicht')}</li>
                  <li>• {t('landing:mapFallback.alternative.register', 'Registrieren Sie sich für erweiterte Funktionen')}</li>
                </ul>
              </div>
            </div>
          </div>
          {consentState === false && (
            <Button 
              onClick={revokeConsent}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {t('landing:mapFallback.reconsider', 'Erneut entscheiden')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("landing:map.title", "Live Transport Map")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t(
              "landing:map.description",
              "Diese Karte zeigt öffentlich verfügbare Transportbewegungen. Aus Datenschutzgründen sind keine personenbezogenen Daten sichtbar."
            )}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* CRITICAL FIX: Banner nur zeigen wenn showBanner === true */}
          {showBanner && (
            <MapConsentBanner 
              onAccept={acceptConsent}
              onDecline={declineConsent}
            />
          )}
          
          {/* CRITICAL FIX: Map NUR rendern wenn isMapAllowed === true */}
          {isMapAllowed && (
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="h-[300px] md:h-[500px] w-full">
                  <React.Suspense fallback={
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Karte wird geladen...</p>
                      </div>
                    </div>
                  }>
                    <LazyHereMap
                      height="100%"
                      width="100%"
                      className="rounded-lg"
                      center={{ lat: 51.1657, lng: 10.4515 }}
                      zoom={6}
                    />
                  </React.Suspense>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* CRITICAL FIX: Fallback zeigen wenn nicht zugestimmt oder abgelehnt */}
          {!isMapAllowed && !showBanner && <MapFallbackContent />}
        </div>
      </div>
    </section>
  );
};

export default LiveMapSection;

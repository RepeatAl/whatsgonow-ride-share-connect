
import React from "react";
import { useTranslation } from "react-i18next";
import type { GeoLocation } from "@/types/upload";

interface LocationNoticeTextProps {
  currentLocation: GeoLocation | null;
}

export function LocationNoticeText({ currentLocation }: LocationNoticeTextProps) {
  const { t } = useTranslation(['upload']);

  return (
    <>
      <p className="text-xs text-orange-700 mb-3">
        {t('upload:geolocation_consent', 
          'Möchten Sie diesen Upload mit Ihrem aktuellen Standort verknüpfen? Das hilft dabei, Ihre Artikel später auf der Karte zu finden.'
        )}
      </p>
      
      {currentLocation && (
        <div className="text-xs text-orange-600 mb-3 bg-white/50 p-2 rounded">
          <div>📍 {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</div>
          <div>🎯 {t('upload:accuracy', 'Genauigkeit')}: ±{currentLocation.accuracy}m</div>
        </div>
      )}
    </>
  );
}


import React from "react";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { GeoLocation } from "@/types/upload";

interface ConsentStatusIndicatorProps {
  locationStatus: 'none' | 'granted' | 'denied' | 'error';
  currentLocation: GeoLocation | null;
}

export function ConsentStatusIndicator({ 
  locationStatus, 
  currentLocation 
}: ConsentStatusIndicatorProps) {
  const { t } = useTranslation(['upload']);

  const getLocationStatusIcon = () => {
    switch (locationStatus) {
      case 'granted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLocationStatusText = () => {
    switch (locationStatus) {
      case 'granted':
        return t('upload:location_granted', 'Standort wurde erfasst');
      case 'denied':
        return t('upload:location_denied', 'Standortzugriff verweigert');
      case 'error':
        return t('upload:location_error', 'Fehler beim Standortzugriff');
      default:
        return t('upload:location_not_shared', 'Standort wurde nicht geteilt');
    }
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {getLocationStatusIcon()}
        <span className="text-sm font-medium text-orange-900">
          {t('upload:location_sharing', 'Standort teilen')}
        </span>
      </div>
      <Badge 
        variant={locationStatus === 'granted' ? 'default' : 'secondary'}
        className="text-xs"
      >
        {getLocationStatusText()}
      </Badge>
    </div>
  );
}


import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LocationPermissionButtonProps {
  locationStatus: 'none' | 'granted' | 'denied' | 'error';
  isRequestingLocation: boolean;
  onRequestLocation: () => void;
  onRevokeLocation: () => void;
}

export function LocationPermissionButton({
  locationStatus,
  isRequestingLocation,
  onRequestLocation,
  onRevokeLocation
}: LocationPermissionButtonProps) {
  const { t } = useTranslation(['upload']);

  if (locationStatus === 'granted') {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={onRevokeLocation}
        className="text-orange-700 border-orange-300 hover:bg-orange-200"
      >
        <XCircle className="h-3 w-3 mr-1" />
        {t('upload:remove_location', 'Standort entfernen')}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onRequestLocation}
      disabled={isRequestingLocation}
      className="text-orange-700 border-orange-300 hover:bg-orange-200"
    >
      <MapPin className="h-3 w-3 mr-1" />
      {isRequestingLocation 
        ? t('upload:requesting_location', 'Wird ermittelt...') 
        : locationStatus === 'denied' || locationStatus === 'error'
          ? t('upload:retry_location', 'Erneut versuchen')
          : t('upload:share_location', 'Standort teilen')
      }
    </Button>
  );
}

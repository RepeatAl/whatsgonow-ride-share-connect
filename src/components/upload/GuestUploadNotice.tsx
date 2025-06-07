
import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Info, Shield, MapPin, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { GeoLocation } from "@/types/upload";

interface GuestUploadNoticeProps {
  fileCount?: number;
  expiresAt?: string;
  onLocationConsent?: (location: GeoLocation | null) => void;
  locationEnabled?: boolean;
}

export function GuestUploadNotice({ 
  fileCount = 0, 
  expiresAt, 
  onLocationConsent,
  locationEnabled = false 
}: GuestUploadNoticeProps) {
  const { t } = useTranslation(['upload', 'common']);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'none' | 'granted' | 'denied' | 'error'>('none');
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const hoursLeft = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursLeft < 1) return t('upload:expires_soon', 'Läuft bald ab');
    if (hoursLeft < 24) return t('upload:expires_hours', '{{hours}}h verbleibend', { hours: hoursLeft });
    
    const daysLeft = Math.floor(hoursLeft / 24);
    return t('upload:expires_days', '{{days}} Tage verbleibend', { days: daysLeft });
  };

  const requestLocationAccess = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error(t('upload:geolocation_not_supported', 'Standortdienste werden nicht unterstützt'));
      setLocationStatus('error');
      return;
    }

    setIsRequestingLocation(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const location: GeoLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        timestamp: new Date().toISOString()
      };

      setCurrentLocation(location);
      setLocationStatus('granted');
      
      if (onLocationConsent) {
        onLocationConsent(location);
      }

      toast.success(t('upload:location_captured', 'Standort erfolgreich erfasst'));
      
    } catch (error) {
      console.error('Geolocation error:', error);
      setLocationStatus('denied');
      
      if (onLocationConsent) {
        onLocationConsent(null);
      }

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(t('upload:location_permission_denied', 'Standortzugriff wurde verweigert'));
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error(t('upload:location_unavailable', 'Standort ist nicht verfügbar'));
            break;
          case error.TIMEOUT:
            toast.error(t('upload:location_timeout', 'Standortabfrage ist abgelaufen'));
            break;
          default:
            toast.error(t('upload:location_error', 'Fehler beim Abrufen des Standorts'));
        }
      } else {
        toast.error(t('upload:location_error', 'Fehler beim Abrufen des Standorts'));
      }
    } finally {
      setIsRequestingLocation(false);
    }
  }, [onLocationConsent, t]);

  const revokeLocationAccess = useCallback(() => {
    setCurrentLocation(null);
    setLocationStatus('none');
    
    if (onLocationConsent) {
      onLocationConsent(null);
    }
    
    toast.info(t('upload:location_revoked', 'Standortzugriff wurde entfernt'));
  }, [onLocationConsent, t]);

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
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-orange-900">
                {t('upload:guest_mode_title', 'Gast-Upload-Modus')}
              </h3>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                {t('upload:temporary', 'Temporär')}
              </Badge>
            </div>
            
            <div className="text-sm text-orange-800 space-y-2">
              <p>
                {t('upload:guest_explanation', 
                  'Sie können Bilder ohne Anmeldung hochladen. Diese werden temporär gespeichert.'
                )}
              </p>
              
              {fileCount > 0 && (
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>
                    {t('upload:files_uploaded', '{{count}} Datei(en) hochgeladen', { count: fileCount })}
                  </span>
                </div>
              )}
              
              {expiresAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeLeft(expiresAt)}</span>
                </div>
              )}
            </div>

            {/* DSGVO-konformer Standort-Consent */}
            <div className="bg-orange-100 p-3 rounded border border-orange-200">
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

              <div className="flex gap-2">
                {locationStatus === 'none' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={requestLocationAccess}
                    disabled={isRequestingLocation}
                    className="text-orange-700 border-orange-300 hover:bg-orange-200"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {isRequestingLocation 
                      ? t('upload:requesting_location', 'Wird ermittelt...') 
                      : t('upload:share_location', 'Standort teilen')
                    }
                  </Button>
                )}
                
                {locationStatus === 'granted' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={revokeLocationAccess}
                    className="text-orange-700 border-orange-300 hover:bg-orange-200"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    {t('upload:remove_location', 'Standort entfernen')}
                  </Button>
                )}
                
                {locationStatus === 'denied' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={requestLocationAccess}
                    disabled={isRequestingLocation}
                    className="text-orange-700 border-orange-300 hover:bg-orange-200"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    {t('upload:retry_location', 'Erneut versuchen')}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded border border-orange-200">
              {t('upload:login_to_save', 
                'Melden Sie sich an, um Ihre Bilder dauerhaft zu speichern und Artikel zu veröffentlichen.'
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

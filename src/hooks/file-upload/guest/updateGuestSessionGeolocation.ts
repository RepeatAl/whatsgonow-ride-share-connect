
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type { TFunction } from "i18next";
import type { GeoLocation, GuestUploadSession } from "@/types/upload";

export interface GeolocationUpdateResult {
  success: boolean;
  location: GeoLocation | null;
  session: GuestUploadSession | null;
}

export const updateGuestSessionGeolocation = async (
  session: GuestUploadSession,
  location: GeoLocation | null,
  t: TFunction
): Promise<GeolocationUpdateResult> => {
  try {
    console.log('📍 Updating session geolocation:', location ? 'with location' : 'without location');

    const updateData = location 
      ? {
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy,
          location_consent: true,
          location_captured_at: location.timestamp
        }
      : {
          lat: null,
          lng: null,
          accuracy: null,
          location_consent: false,
          location_captured_at: null
        };

    const { error } = await supabase
      .from('guest_upload_sessions')
      .update(updateData)
      .eq('session_id', session.session_id);

    if (error) throw error;

    // Update session object
    const updatedSession: GuestUploadSession = { 
      ...session, 
      ...updateData 
    };
    
    console.log('✅ Session geolocation updated successfully');
    
    return {
      success: true,
      location,
      session: updatedSession
    };
  } catch (error) {
    console.error('❌ Error updating session location:', error);
    toast.error(t('upload:location_update_error', 'Fehler beim Speichern der Standortdaten'));
    
    return {
      success: false,
      location: null,
      session
    };
  }
};

export const requestGeolocationPermission = async (
  t: TFunction
): Promise<GeoLocation | null> => {
  if (!navigator.geolocation) {
    toast.error(t('upload:geolocation_not_supported', 'Standortdienste werden nicht unterstützt'));
    return null;
  }

  try {
    console.log('🔍 Requesting geolocation permission...');
    
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

    console.log('✅ Geolocation captured:', location);
    toast.success(t('upload:location_captured', 'Standort erfolgreich erfasst'));
    
    return location;
  } catch (error) {
    console.error('❌ Geolocation error:', error);
    
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
    
    return null;
  }
};


// 🚨 CRITICAL GDPR HOOK - Do not modify without CTO approval! (Stand: 13.06.2025)
// Zentrale Map-Consent-Verwaltung mit strikter DSGVO-konformer Dreiwerte-Logik

import { useState, useEffect, useCallback } from 'react';

const MAP_CONSENT_KEY = 'whatsgonow-map-consent';
const MAP_CONSENT_DATE_KEY = 'whatsgonow-map-consent-date';

export type MapConsentState = null | false | true;
// null = Banner zeigen (unbekannt)
// false = explizit abgelehnt
// true = explizit akzeptiert nach Button-Click

interface UseMapConsentReturn {
  consentState: MapConsentState;
  showBanner: boolean;
  acceptConsent: () => void;
  declineConsent: () => void;
  revokeConsent: () => void;
  isMapAllowed: boolean;
}

export const useMapConsent = (): UseMapConsentReturn => {
  const [consentState, setConsentState] = useState<MapConsentState>(null);

  // CRITICAL: Initial state ist IMMER null (Banner zeigen)
  // Keine automatische Wiederherstellung aus localStorage!
  useEffect(() => {
    // Beim Mount ist consentState immer null
    // User muss explizit erneut entscheiden
    console.log('🛡️ Map Consent: Initial state = null (Banner required)');
  }, []);

  const showBanner = consentState === null;
  const isMapAllowed = consentState === true;

  const acceptConsent = useCallback(() => {
    console.log('🛡️ Map Consent: EXPLICIT ACCEPT by user click');
    localStorage.setItem(MAP_CONSENT_KEY, 'accepted');
    localStorage.setItem(MAP_CONSENT_DATE_KEY, new Date().toISOString());
    setConsentState(true);
  }, []);

  const declineConsent = useCallback(() => {
    console.log('🛡️ Map Consent: EXPLICIT DECLINE by user click');
    localStorage.setItem(MAP_CONSENT_KEY, 'declined');
    localStorage.setItem(MAP_CONSENT_DATE_KEY, new Date().toISOString());
    setConsentState(false);
  }, []);

  const revokeConsent = useCallback(() => {
    console.log('🛡️ Map Consent: REVOKED by user action');
    localStorage.removeItem(MAP_CONSENT_KEY);
    localStorage.removeItem(MAP_CONSENT_DATE_KEY);
    setConsentState(null);
  }, []);

  return {
    consentState,
    showBanner,
    acceptConsent,
    declineConsent,
    revokeConsent,
    isMapAllowed
  };
};

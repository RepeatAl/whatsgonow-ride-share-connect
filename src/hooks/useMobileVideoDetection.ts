
import { useState, useEffect } from 'react';

export const useMobileVideoDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isRealMobile, setIsRealMobile] = useState(false);

  useEffect(() => {
    // Basic mobile detection via user agent
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // Touch device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Screen size detection
    const isSmallScreen = window.innerWidth < 768;
    
    const detectedMobile = mobileUserAgent || (isTouchDevice && isSmallScreen);
    
    setIsMobile(detectedMobile);
    setIsRealMobile(mobileUserAgent);
  }, []);

  return { isMobile, isRealMobile };
};

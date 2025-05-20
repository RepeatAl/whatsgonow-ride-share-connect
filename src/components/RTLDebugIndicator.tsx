
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const RTLDebugIndicator = () => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');
  const [direction, setDirection] = useState(document.documentElement.dir);
  const [storedLang, setStoredLang] = useState(localStorage.getItem('i18nextLng') || 'unknown');
  const isDev = process.env.NODE_ENV === 'development';
  
  useEffect(() => {
    const checkRTL = () => {
      setIsRTL(i18n.language === 'ar');
      setDirection(document.documentElement.dir);
      setStoredLang(localStorage.getItem('i18nextLng') || 'unknown');
    };
    
    // Check on mount
    checkRTL();
    
    // Add listener for language changes
    const handleLanguageChange = () => {
      checkRTL();
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    // Check periodically to catch any external changes to dir or localStorage
    const intervalId = setInterval(checkRTL, 1000);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
      clearInterval(intervalId);
    };
  }, [i18n]);

  if (!isDev) return null;

  return (
    <div 
      className={`fixed z-50 top-0 left-0 right-0 text-center text-xs py-0.5 px-1 ${
        isRTL && direction === 'rtl' 
          ? 'bg-green-500 text-white'
          : isRTL || direction === 'rtl'
            ? 'bg-yellow-500 text-black'
            : 'bg-blue-500 text-white'
      }`}
    >
      {isRTL && direction === 'rtl' 
        ? `✅ RTL aktiv (${i18n.language}) - dir: ${direction} - localStorage: ${storedLang}` 
        : isRTL && direction !== 'rtl'
          ? `⚠️ FEHLER: ${i18n.language} aktiv, aber dir: ${direction} - localStorage: ${storedLang}`
          : direction === 'rtl' && !isRTL
            ? `⚠️ FEHLER: dir=rtl, aber Sprache: ${i18n.language} - localStorage: ${storedLang}`
            : `🔄 LTR: ${i18n.language} - dir: ${direction} - localStorage: ${storedLang}`
      }
    </div>
  );
};

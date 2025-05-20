
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const RTLDebugIndicator = () => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');
  const [direction, setDirection] = useState(document.documentElement.dir);
  const isDev = process.env.NODE_ENV === 'development';
  
  useEffect(() => {
    const checkRTL = () => {
      setIsRTL(i18n.language === 'ar');
      setDirection(document.documentElement.dir);
    };
    
    // Check on mount
    checkRTL();
    
    // Add listener for language changes
    const handleLanguageChange = () => {
      checkRTL();
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
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
        ? '✅ RTL aktiviert (Arabisch) - HTML dir: rtl' 
        : isRTL && direction !== 'rtl'
          ? '⚠️ FEHLER: Arabische Sprache aktiv, aber HTML dir: ' + direction
          : direction === 'rtl' && !isRTL
            ? '⚠️ FEHLER: HTML dir=rtl, aber Sprache: ' + i18n.language
            : '🔄 LTR Modus - ' + i18n.language
      }
    </div>
  );
};

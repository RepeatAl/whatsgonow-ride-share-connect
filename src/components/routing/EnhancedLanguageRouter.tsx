
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supportedLanguages } from '@/config/supportedLanguages';

interface EnhancedLanguageRouterProps {
  children: React.ReactNode;
}

export const EnhancedLanguageRouter: React.FC<EnhancedLanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLanguageByUrl, getLanguageFromUrl } = useLanguage();

  const langFromUrl = getLanguageFromUrl(location.pathname);
  const langCodes = supportedLanguages.map(l => l.code);
  const pathParts = location.pathname.split('/').filter(Boolean);
  const firstPart = pathParts[0];

  useEffect(() => {
    // Wenn kein gültiger Sprachpräfix: Redirect zur Standardsprache
    if (!langCodes.includes(firstPart)) {
      const defaultLang = localStorage.getItem('i18nextLng') || 'de';
      const redirectPath = `/${defaultLang}${location.pathname}`;
      if (location.pathname !== `/${defaultLang}`) {
        navigate(redirectPath.replace(/\/+$/, ''), { replace: true });
      }
      return;
    }

    // Wenn gültiger Sprachpräfix erkannt → Sprache setzen
    setLanguageByUrl(location.pathname);
  }, [location.pathname, navigate, firstPart, langCodes, setLanguageByUrl]);

  // Wenn gültiger Sprachpräfix → entferne ihn für Routing
  if (langCodes.includes(firstPart)) {
    const restOfPath = pathParts.slice(1).join('/');
    const virtualPath = '/' + restOfPath;

    return <div key={langFromUrl}>{React.cloneElement(children as React.ReactElement, { location: { ...location, pathname: virtualPath } })}</div>;
  }

  // Kein Sprachpräfix erkannt → render normal
  return <>{children}</>;
};

export default EnhancedLanguageRouter;

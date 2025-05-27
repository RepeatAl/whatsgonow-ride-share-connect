
import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface LanguageContextValue {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  getLocalizedUrl: (path: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  currentLanguage: 'de',
  setLanguage: () => {},
  getLocalizedUrl: (path: string) => path,
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSimpleAuth();
  
  const currentLanguage = i18n.language || 'de';
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(currentLanguage);

  // Extract language from URL path
  const pathLanguage = location.pathname.split('/')[1];
  const supportedLanguages = ['de', 'en', 'fr', 'es', 'it'];

  useEffect(() => {
    // Check if the URL starts with a supported language
    if (supportedLanguages.includes(pathLanguage)) {
      if (pathLanguage !== currentLanguage) {
        i18n.changeLanguage(pathLanguage);
      }
    } else {
      // If no valid language in URL, redirect to the current language
      const newPath = `/${currentLanguage}${location.pathname}${location.search}`;
      navigate(newPath, { replace: true });
    }
  }, [pathLanguage, currentLanguage, location.pathname, location.search, navigate, i18n]);

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    // Update URL with new language
    const pathWithoutLang = location.pathname.split('/').slice(2).join('/');
    const newPath = `/${lang}/${pathWithoutLang}${location.search}`;
    navigate(newPath, { replace: true });
  };

  const getLocalizedUrl = (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // If path is empty or just '/', return language prefix
    if (!cleanPath || cleanPath === '') {
      return `/${currentLanguage}`;
    }
    
    // If path already starts with language code, return as is
    if (cleanPath.startsWith(`${currentLanguage}/`)) {
      return `/${cleanPath}`;
    }
    
    // Add language prefix
    return `/${currentLanguage}/${cleanPath}`;
  };

  const value: LanguageContextValue = {
    currentLanguage,
    setLanguage,
    getLocalizedUrl,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

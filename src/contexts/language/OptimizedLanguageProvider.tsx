
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface OptimizedLanguageContextValue {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  getLocalizedUrl: (path: string) => string;
  isRTL: boolean;
  supportedLanguages: string[];
}

const OptimizedLanguageContext = createContext<OptimizedLanguageContextValue>({
  currentLanguage: 'de',
  setLanguage: () => {},
  getLocalizedUrl: (path: string) => path,
  isRTL: false,
  supportedLanguages: ['de', 'en'],
});

export const useOptimizedLanguage = () => useContext(OptimizedLanguageContext);

export const OptimizedLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSimpleAuth();
  
  const supportedLanguages = useMemo(() => ['de', 'en', 'fr', 'es', 'it'], []);
  const currentLanguage = i18n.language || 'de';
  const isRTL = useMemo(() => ['ar', 'he', 'fa', 'ur'].includes(currentLanguage), [currentLanguage]);

  // Extract language from URL path
  const pathLanguage = useMemo(() => location.pathname.split('/')[1], [location.pathname]);

  // Debounced navigation to prevent rapid redirects
  const debouncedNavigate = useMemo(
    () => debounce((path: string) => navigate(path, { replace: true }), 100),
    [navigate]
  );

  useEffect(() => {
    // Check if the URL starts with a supported language
    if (supportedLanguages.includes(pathLanguage)) {
      if (pathLanguage !== currentLanguage) {
        i18n.changeLanguage(pathLanguage);
      }
    } else {
      // If no valid language in URL, redirect to the current language
      const newPath = `/${currentLanguage}${location.pathname}${location.search}`;
      debouncedNavigate(newPath);
    }
  }, [pathLanguage, currentLanguage, location.pathname, location.search, debouncedNavigate, i18n, supportedLanguages]);

  const setLanguage = useMemo(() => (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
      // Update URL with new language
      const pathWithoutLang = location.pathname.split('/').slice(2).join('/');
      const newPath = `/${lang}/${pathWithoutLang}${location.search}`;
      navigate(newPath, { replace: true });
    }
  }, [i18n, location.pathname, location.search, navigate, supportedLanguages]);

  const getLocalizedUrl = useMemo(() => (path: string): string => {
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
  }, [currentLanguage]);

  const value: OptimizedLanguageContextValue = useMemo(() => ({
    currentLanguage,
    setLanguage,
    getLocalizedUrl,
    isRTL,
    supportedLanguages,
  }), [currentLanguage, setLanguage, getLocalizedUrl, isRTL, supportedLanguages]);

  return (
    <OptimizedLanguageContext.Provider value={value}>
      {children}
    </OptimizedLanguageContext.Provider>
  );
};

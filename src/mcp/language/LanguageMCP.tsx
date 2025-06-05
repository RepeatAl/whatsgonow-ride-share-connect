
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '@/config/supportedLanguages';

interface LanguageMCPContextValue {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  setLanguageByCode: (lang: string) => Promise<void>;
  getLocalizedUrl: (path: string) => string;
  isRTL: boolean;
  languageLoading: boolean;
  supportedLanguages: Array<{
    code: string;
    name: string;
    localName: string;
    flag: string;
    rtl: boolean;
    implemented: boolean;
  }>;
}

const LanguageMCPContext = createContext<LanguageMCPContextValue>({
  currentLanguage: 'de',
  setLanguage: () => {},
  setLanguageByCode: async () => {},
  getLocalizedUrl: (path: string) => path,
  isRTL: false,
  languageLoading: false,
  supportedLanguages: [],
});

export const useLanguageMCP = () => useContext(LanguageMCPContext);

export const LanguageMCPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [languageLoading, setLanguageLoading] = useState(false);
  
  // Extract language from current URL path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const urlLanguage = pathSegments[0];
  
  // Determine current language: prioritize URL, then i18n, then default
  const currentLanguage = supportedLanguages.some(l => l.code === urlLanguage) 
    ? urlLanguage 
    : i18n.language || 'de';
    
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(currentLanguage);

  // Sync i18n with URL language on mount/route change
  useEffect(() => {
    if (urlLanguage && supportedLanguages.some(l => l.code === urlLanguage)) {
      if (i18n.language !== urlLanguage) {
        i18n.changeLanguage(urlLanguage);
      }
    }
  }, [urlLanguage, i18n]);

  const mappedSupportedLanguages = supportedLanguages.map(lang => ({
    code: lang.code,
    name: lang.name,
    localName: lang.localName,
    flag: lang.flag,
    rtl: lang.rtl || false,
    implemented: lang.implemented,
  }));

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    updateUrlForLanguage(lang);
  };

  const setLanguageByCode = async (lang: string) => {
    if (languageLoading || currentLanguage === lang) return;
    
    try {
      setLanguageLoading(true);
      
      // Change i18n language
      await i18n.changeLanguage(lang);
      
      // Update document direction for RTL languages
      const newIsRTL = ['ar', 'he', 'fa', 'ur'].includes(lang);
      document.documentElement.dir = newIsRTL ? 'rtl' : 'ltr';
      document.body.dir = newIsRTL ? 'rtl' : 'ltr';
      
      // Update localStorage
      localStorage.setItem('i18nextLng', lang);
      
      // Update URL
      updateUrlForLanguage(lang);
      
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    } finally {
      setTimeout(() => setLanguageLoading(false), 300);
    }
  };

  const updateUrlForLanguage = (newLang: string) => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Remove current language prefix if present
    const isCurrentLangInUrl = supportedLanguages.some(l => l.code === pathSegments[0]);
    const pathWithoutLang = isCurrentLangInUrl 
      ? pathSegments.slice(1).join('/')
      : pathSegments.join('/');
    
    // Build new path
    const newPath = pathWithoutLang 
      ? `/${newLang}/${pathWithoutLang}`
      : `/${newLang}`;
    
    navigate(newPath + location.search, { replace: true });
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

  const value: LanguageMCPContextValue = {
    currentLanguage,
    setLanguage,
    setLanguageByCode,
    getLocalizedUrl,
    isRTL,
    languageLoading,
    supportedLanguages: mappedSupportedLanguages,
  };

  return (
    <LanguageMCPContext.Provider value={value}>
      {children}
    </LanguageMCPContext.Provider>
  );
};

export const LanguageMCP = LanguageMCPProvider;

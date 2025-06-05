
import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
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
  const { user } = useSimpleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract language from current URL path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const urlLanguage = pathSegments[0];
  
  // Determine current language: prioritize URL, then i18n, then default
  const currentLanguage = supportedLanguages.some(l => l.code === urlLanguage) 
    ? urlLanguage 
    : i18n.language || 'de';
    
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(currentLanguage);
  const languageLoading = false;

  // Sync i18n with URL language on mount/route change
  useEffect(() => {
    if (urlLanguage && supportedLanguages.some(l => l.code === urlLanguage)) {
      if (i18n.language !== urlLanguage) {
        console.log('[LanguageMCP] Syncing i18n language to URL:', urlLanguage);
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
    try {
      // Change i18n language
      await i18n.changeLanguage(lang);
      
      // Update URL to match new language
      updateUrlForLanguage(lang);
      
      console.log('[LanguageMCP] Language changed to:', lang);
    } catch (error) {
      console.error('[LanguageMCP] Error changing language:', error);
      throw error;
    }
  };

  const updateUrlForLanguage = (newLang: string) => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // Remove current language prefix if present
    const isCurrentLangInUrl = supportedLanguages.some(l => l.code === pathSegments[0]);
    const pathWithoutLang = isCurrentLangInUrl 
      ? '/' + pathSegments.slice(1).join('/')
      : currentPath;
    
    // Build new path with new language
    const newPath = `/${newLang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    
    console.log('[LanguageMCP] Navigating from', currentPath, 'to', newPath);
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

// Export the provider as LanguageMCP for backward compatibility
export const LanguageMCP = LanguageMCPProvider;

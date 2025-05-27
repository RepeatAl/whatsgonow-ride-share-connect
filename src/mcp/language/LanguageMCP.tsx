
import React, { createContext, useContext } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useTranslation } from 'react-i18next';

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
  
  const currentLanguage = i18n.language || 'de';
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(currentLanguage);
  const languageLoading = false;

  const supportedLanguages = [
    { code: 'de', name: 'Deutsch', localName: 'Deutsch', flag: '🇩🇪', rtl: false, implemented: true },
    { code: 'en', name: 'English', localName: 'English', flag: '🇺🇸', rtl: false, implemented: true },
    { code: 'fr', name: 'Français', localName: 'Français', flag: '🇫🇷', rtl: false, implemented: false },
    { code: 'es', name: 'Español', localName: 'Español', flag: '🇪🇸', rtl: false, implemented: false },
    { code: 'it', name: 'Italiano', localName: 'Italiano', flag: '🇮🇹', rtl: false, implemented: false },
  ];

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const setLanguageByCode = async (lang: string) => {
    i18n.changeLanguage(lang);
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
    supportedLanguages,
  };

  return (
    <LanguageMCPContext.Provider value={value}>
      {children}
    </LanguageMCPContext.Provider>
  );
};

// Export the provider as LanguageMCP for backward compatibility
export const LanguageMCP = LanguageMCPProvider;

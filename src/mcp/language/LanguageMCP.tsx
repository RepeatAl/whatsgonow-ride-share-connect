
import React, { createContext, useContext } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useTranslation } from 'react-i18next';

interface LanguageMCPContextValue {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  getLocalizedUrl: (path: string) => string;
  isRTL: boolean;
}

const LanguageMCPContext = createContext<LanguageMCPContextValue>({
  currentLanguage: 'de',
  setLanguage: () => {},
  getLocalizedUrl: (path: string) => path,
  isRTL: false,
});

export const useLanguageMCP = () => useContext(LanguageMCPContext);

export const LanguageMCPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { user } = useSimpleAuth();
  
  const currentLanguage = i18n.language || 'de';
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(currentLanguage);

  const setLanguage = (lang: string) => {
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
    getLocalizedUrl,
    isRTL,
  };

  return (
    <LanguageMCPContext.Provider value={value}>
      {children}
    </LanguageMCPContext.Provider>
  );
};

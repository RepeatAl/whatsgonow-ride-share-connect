
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

interface OptimizedLanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  availableLanguages: string[];
  isLoading: boolean;
  getLocalizedPath: (path: string) => string;
  switchLanguage: (newLang: string) => void;
}

const OptimizedLanguageContext = createContext<OptimizedLanguageContextType | undefined>(undefined);

export const useOptimizedLanguage = () => {
  const context = useContext(OptimizedLanguageContext);
  if (!context) {
    throw new Error('useOptimizedLanguage must be used within OptimizedLanguageProvider');
  }
  return context;
};

interface OptimizedLanguageProviderProps {
  children: ReactNode;
}

export const OptimizedLanguageProvider = ({ children }: OptimizedLanguageProviderProps) => {
  const { i18n } = useTranslation();
  const { user } = useOptimizedAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const availableLanguages = ['de', 'en', 'ar', 'pl', 'fr', 'es'];
  const currentLanguage = i18n.language || 'de';

  const getLocalizedPath = useCallback((path: string) => {
    // Remove existing language prefix if present
    const cleanPath = path.replace(/^\/[a-z]{2}\//, '/');
    return `/${currentLanguage}${cleanPath === '/' ? '' : cleanPath}`;
  }, [currentLanguage]);

  const setLanguage = async (lang: string) => {
    if (!availableLanguages.includes(lang)) {
      console.warn(`Language ${lang} is not available`);
      return;
    }

    setIsLoading(true);
    try {
      await i18n.changeLanguage(lang);
      localStorage.setItem('preferred-language', lang);
      
      // Save to user profile if authenticated
      if (user) {
        console.log('TODO: Save language preference to user profile:', lang);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchLanguage = useCallback((newLang: string) => {
    const currentPath = location.pathname;
    const newPath = getLocalizedPath(currentPath.replace(/^\/[a-z]{2}\//, '/'));
    const finalPath = newPath.replace(`/${currentLanguage}`, `/${newLang}`);
    
    setLanguage(newLang);
    navigate(finalPath, { replace: true });
  }, [location.pathname, currentLanguage, getLocalizedPath, navigate, setLanguage]);

  useEffect(() => {
    // Initialize language from URL or localStorage
    const pathLang = location.pathname.match(/^\/([a-z]{2})\//)?.[1];
    const savedLanguage = localStorage.getItem('preferred-language');
    
    if (pathLang && availableLanguages.includes(pathLang)) {
      if (pathLang !== currentLanguage) {
        i18n.changeLanguage(pathLang);
      }
    } else if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n, location.pathname, currentLanguage]);

  return (
    <OptimizedLanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages,
        isLoading,
        getLocalizedPath,
        switchLanguage,
      }}
    >
      {children}
    </OptimizedLanguageContext.Provider>
  );
};

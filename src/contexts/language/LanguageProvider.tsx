
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  availableLanguages: string[];
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const { i18n } = useTranslation();
  const { user } = useOptimizedAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const availableLanguages = ['de', 'en', 'ar', 'pl', 'fr', 'es'];
  const currentLanguage = i18n.language || 'de';

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
        // TODO: Save language preference to user profile
        console.log('TODO: Save language preference to user profile:', lang);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize language from localStorage or user preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

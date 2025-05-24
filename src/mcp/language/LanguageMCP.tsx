
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { changeAppLanguage } from '@/services/LanguageService';
import { supportedLanguages, languageCodes } from '@/config/supportedLanguages';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { defaultLanguage } from '@/contexts/language/constants';

interface LanguageMCPContextType {
  currentLanguage: string;
  setLanguageByCode: (lang: string, storeInProfile?: boolean) => Promise<void>;
  getLocalizedUrl: (path: string, lang?: string) => string;
  languageLoading: boolean;
  supportedLanguages: typeof supportedLanguages;
  isRtl: boolean;
}

const LanguageMCPContext = createContext<LanguageMCPContextType | undefined>(undefined);

interface LanguageMCPProps {
  children: React.ReactNode;
  initialLanguage: string;
}

/**
 * Language MCP - Master Control Point for all language-related operations
 * Handles: UI language switching, URL localization, RTL support
 * Scope: Global UI, routing, static content
 */
export const LanguageMCP: React.FC<LanguageMCPProps> = ({ 
  children, 
  initialLanguage 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLanguage);
  const [languageLoading, setLanguageLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Initialize i18n with provided language
  React.useEffect(() => {
    const langMeta = supportedLanguages.find(l => l.code === initialLanguage);
    if (langMeta) {
      changeAppLanguage(initialLanguage);
      setCurrentLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  // Memoized language metadata
  const currentLanguageMeta = useMemo(() => {
    return supportedLanguages.find(l => l.code === currentLanguage);
  }, [currentLanguage]);

  const isRtl = useMemo(() => {
    return currentLanguageMeta?.rtl ?? false;
  }, [currentLanguageMeta]);

  // Language change with navigation
  const setLanguageByCode = useCallback(async (lang: string, storeInProfile: boolean = true) => {
    if (lang === currentLanguage) return;
    
    try {
      setLanguageLoading(true);
      
      const langMeta = supportedLanguages.find(l => l.code === lang);
      if (!langMeta) return;
      
      // Apply language change
      await changeAppLanguage(lang);
      setCurrentLanguage(lang);
      
      // Update URL with new language
      const pathSegments = location.pathname.split('/').filter(Boolean);
      const currentLang = pathSegments[0];
      
      if (languageCodes.includes(currentLang)) {
        // Replace existing language
        pathSegments[0] = lang;
      } else {
        // Add language prefix
        pathSegments.unshift(lang);
      }
      
      const newPath = '/' + pathSegments.join('/');
      navigate(newPath, { replace: true });
      
      // Store in user profile if logged in
      if (user?.id && storeInProfile) {
        try {
          await supabase
            .from('profiles')
            .update({ language: lang })
            .eq('user_id', user.id);
        } catch (error) {
          console.error('Failed to update user language preference:', error);
        }
      }

    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setLanguageLoading(false);
    }
  }, [currentLanguage, user?.id, location.pathname, navigate]);

  // URL helpers
  const getLocalizedUrl = useCallback((path: string, lang?: string) => {
    const targetLang = lang || currentLanguage;
    // Remove leading slash and add language prefix
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return cleanPath ? `/${targetLang}/${cleanPath}` : `/${targetLang}`;
  }, [currentLanguage]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    currentLanguage,
    setLanguageByCode,
    getLocalizedUrl,
    languageLoading,
    supportedLanguages,
    isRtl,
  }), [
    currentLanguage,
    setLanguageByCode,
    getLocalizedUrl,
    languageLoading,
    isRtl,
  ]);

  return (
    <LanguageMCPContext.Provider value={contextValue}>
      {children}
    </LanguageMCPContext.Provider>
  );
};

export const useLanguageMCP = () => {
  const context = useContext(LanguageMCPContext);
  if (context === undefined) {
    throw new Error('useLanguageMCP must be used within a LanguageMCP');
  }
  return context;
};

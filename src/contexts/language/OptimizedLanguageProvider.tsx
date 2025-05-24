
// DEPRECATED: This provider is deprecated in favor of MCP architecture
// Use @/mcp/language/LanguageMCP instead

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { changeAppLanguage } from '@/services/LanguageService';
import { supportedLanguages, languageCodes } from '@/config/supportedLanguages';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { LanguageContextType } from './types';
import { defaultLanguage } from './constants';

// Show deprecation warning
console.warn('[DEPRECATED] OptimizedLanguageProvider is deprecated. Use @/mcp/language/LanguageMCP instead.');

const OptimizedLanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface OptimizedLanguageProviderProps {
  children: React.ReactNode;
  initialLanguage: string;
}

/**
 * @deprecated Use @/mcp/language/LanguageMCP instead
 * This provider is maintained for backward compatibility only
 */
export const OptimizedLanguageProvider: React.FC<OptimizedLanguageProviderProps> = ({ 
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

  const getLanguageFromUrl = useCallback((path: string) => {
    const segments = path.split('/').filter(Boolean);
    const possibleLang = segments[0];
    return languageCodes.includes(possibleLang) ? possibleLang : defaultLanguage;
  }, []);

  const setLanguageByUrl = useCallback(async (path: string) => {
    const langFromUrl = getLanguageFromUrl(path);
    if (langFromUrl !== currentLanguage) {
      await setLanguageByCode(langFromUrl, false);
    }
  }, [currentLanguage, setLanguageByCode, getLanguageFromUrl]);

  const ensureNamespaceLoaded = useCallback(async (namespace: string | string[]): Promise<void> => {
    // Placeholder for namespace loading logic
    return Promise.resolve();
  }, []);

  // Memoized context value
  const contextValue = useMemo(() => ({
    currentLanguage,
    setLanguageByCode,
    setLanguageByUrl,
    getLocalizedUrl,
    getLanguageFromUrl,
    languageLoading,
    supportedLanguages,
    isRtl,
    ensureNamespaceLoaded,
  }), [
    currentLanguage,
    setLanguageByCode,
    setLanguageByUrl,
    getLocalizedUrl,
    getLanguageFromUrl,
    languageLoading,
    isRtl,
    ensureNamespaceLoaded,
  ]);

  return (
    <OptimizedLanguageContext.Provider value={contextValue}>
      {children}
    </OptimizedLanguageContext.Provider>
  );
};

/**
 * @deprecated Use useLanguageMCP from @/mcp/language/LanguageMCP instead
 */
export const useOptimizedLanguage = () => {
  const context = useContext(OptimizedLanguageContext);
  if (context === undefined) {
    throw new Error('useOptimizedLanguage must be used within an OptimizedLanguageProvider');
  }
  return context;
};

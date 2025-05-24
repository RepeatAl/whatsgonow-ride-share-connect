
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { changeAppLanguage } from '@/services/LanguageService';
import { supportedLanguages } from '@/config/supportedLanguages';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import i18next from 'i18next';
import { LanguageContextType } from './types';
import { defaultLanguage } from './constants';
import { extractLanguageFromUrl, addLanguageToUrl } from './utils';

// Create the context
const OptimizedLanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const OptimizedLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);
  const [languageLoading, setLanguageLoading] = useState<boolean>(false);
  const [isRtl, setIsRtl] = useState<boolean>(false);
  const { user } = useAuth();

  console.log('[OptimizedLanguageProvider] === SIMPLIFIED DEBUG ===');
  console.log('[OptimizedLanguageProvider] Current path:', location.pathname);
  console.log('[OptimizedLanguageProvider] Current language:', currentLanguage);

  // Memoize language metadata
  const currentLanguageMeta = useMemo(() => {
    return supportedLanguages.find(l => l.code === currentLanguage);
  }, [currentLanguage]);

  // Memoized method to ensure namespaces are loaded
  const ensureNamespaceLoaded = useCallback(async (namespace: string | string[]) => {
    const namespaces = Array.isArray(namespace) ? namespace : [namespace];
    try {
      await i18next.loadNamespaces(namespaces);
    } catch (error) {
      console.error(`[i18n] Error loading namespaces ${namespaces.join(', ')}:`, error);
    }
  }, []);

  // Simplified language setter - NO URL manipulation
  const setLanguageByCode = useCallback(async (lang: string, storeInProfile: boolean = true) => {
    if (lang === currentLanguage) return;
    
    console.log('[OptimizedLanguageProvider] Setting language to:', lang);
    
    try {
      setLanguageLoading(true);
      
      // Find language metadata
      const langMeta = supportedLanguages.find(l => l.code === lang);
      if (!langMeta) return;
      
      // Apply language change silently
      await changeAppLanguage(lang);
      
      // Update state in batch
      setCurrentLanguage(lang);
      setIsRtl(langMeta.rtl ?? false);
      
      // Store preference in user profile if logged in
      if (user?.id && storeInProfile) {
        try {
          await supabase
            .from('profiles')
            .update({ language: lang })
            .eq('user_id', user.id);
            
          console.log('[OptimizedLanguageProvider] Updated user profile language preference:', lang);
        } catch (error) {
          console.error('[OptimizedLanguageProvider] Failed to update user language preference:', error);
        }
      }

    } catch (error) {
      console.error('[OptimizedLanguageProvider] Error changing language:', error);
    } finally {
      setLanguageLoading(false);
    }
  }, [currentLanguage, user?.id]);

  // Memoized URL helpers - NO navigation, just URL construction
  const getLocalizedUrl = useCallback((path: string, lang?: string) => {
    const targetLang = lang || currentLanguage;
    return addLanguageToUrl(path, targetLang);
  }, [currentLanguage]);

  const getLanguageFromUrl = useCallback((path: string) => {
    return extractLanguageFromUrl(path);
  }, []);

  const setLanguageByUrl = useCallback(async (path: string) => {
    const langFromUrl = extractLanguageFromUrl(path);
    if (langFromUrl !== currentLanguage) {
      await setLanguageByCode(langFromUrl, false);
    }
  }, [currentLanguage, setLanguageByCode]);

  // Initialize language from URL on first load - SIMPLIFIED
  useEffect(() => {
    const urlLang = extractLanguageFromUrl(location.pathname);
    console.log('[OptimizedLanguageProvider] URL language detected:', urlLang);
    
    // Only update if different from current and is a valid language
    if (urlLang && urlLang !== currentLanguage) {
      const langMeta = supportedLanguages.find(l => l.code === urlLang);
      if (langMeta) {
        console.log('[OptimizedLanguageProvider] Initializing language from URL:', urlLang);
        setCurrentLanguage(urlLang);
        setIsRtl(langMeta.rtl ?? false);
        changeAppLanguage(urlLang);
      }
    }
  }, []); // Only run once on mount - NO dependency on location.pathname

  // Memoized context value to prevent unnecessary re-renders
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

// Hook for using language context
export const useOptimizedLanguage = () => {
  const context = useContext(OptimizedLanguageContext);
  if (context === undefined) {
    throw new Error('useOptimizedLanguage must be used within an OptimizedLanguageProvider');
  }
  return context;
};

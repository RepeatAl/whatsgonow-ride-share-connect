
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);
  const [languageLoading, setLanguageLoading] = useState<boolean>(false); // Start with false to prevent flashing
  const [isRtl, setIsRtl] = useState<boolean>(false);
  const { user } = useAuth();

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

  // Memoized method to set language and update URL
  const setLanguageByCode = useCallback(async (lang: string, storeInProfile: boolean = true) => {
    if (lang === currentLanguage) return; // Prevent unnecessary updates
    
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
      
      // Update URL silently without navigation
      const newPath = addLanguageToUrl(location.pathname, lang);
      if (newPath !== location.pathname) {
        window.history.replaceState(null, '', newPath + location.search);
      }
      
      // Store preference in user profile if logged in
      if (user?.id && storeInProfile) {
        try {
          await supabase
            .from('profiles')
            .update({ language: lang })
            .eq('user_id', user.id);
            
          console.log('[LANG] Updated user profile language preference:', lang);
        } catch (error) {
          console.error('[LANG] Failed to update user language preference:', error);
        }
      }

    } catch (error) {
      console.error('[LANG] Error changing language:', error);
    } finally {
      setLanguageLoading(false);
    }
  }, [currentLanguage, location.pathname, location.search, user?.id]);

  // Memoized URL helpers
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

  // Initialize language from URL on first load - simplified
  useEffect(() => {
    const initLanguage = async () => {
      const urlLang = extractLanguageFromUrl(location.pathname);
      
      // Only update if different from current
      if (urlLang && urlLang !== currentLanguage) {
        const langMeta = supportedLanguages.find(l => l.code === urlLang);
        if (langMeta) {
          setCurrentLanguage(urlLang);
          setIsRtl(langMeta.rtl ?? false);
          await changeAppLanguage(urlLang);
        }
      }
    };
    
    initLanguage();
  }, []); // Only run once on mount

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

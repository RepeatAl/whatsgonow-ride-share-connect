
import React, { createContext, useContext, useEffect, useState } from 'react';
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
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);
  const [languageLoading, setLanguageLoading] = useState<boolean>(true);
  const [isRtl, setIsRtl] = useState<boolean>(false);
  const { user } = useAuth();

  // Method to ensure namespaces are loaded
  const ensureNamespaceLoaded = async (namespace: string | string[]) => {
    const namespaces = Array.isArray(namespace) ? namespace : [namespace];
    try {
      await i18next.loadNamespaces(namespaces);
    } catch (error) {
      console.error(`[i18n] Error loading namespaces ${namespaces.join(', ')}:`, error);
    }
  };

  // Method to set language and update URL
  const setLanguageByCode = async (lang: string, storeInProfile: boolean = true) => {
    try {
      setLanguageLoading(true);
      
      // Find language metadata
      const langMeta = supportedLanguages.find(l => l.code === lang);
      if (!langMeta) return;
      
      // Apply language change
      await changeAppLanguage(lang);
      
      // Update state
      setCurrentLanguage(lang);
      setIsRtl(langMeta.rtl);
      
      // Update URL without triggering page reload
      const newPath = addLanguageToUrl(location.pathname, lang);
      navigate(newPath + location.search, { replace: true });
      
      // Store preference in user profile if logged in
      if (user?.id && storeInProfile) {
        try {
          await supabase
            .from('users')
            .update({ language: lang })
            .eq('user_id', user.id);
        } catch (error) {
          console.error('[LANG] Failed to update user language preference:', error);
        }
      }

    } catch (error) {
      console.error('[LANG] Error changing language:', error);
    } finally {
      setLanguageLoading(false);
    }
  };

  // Set language from URL
  const setLanguageByUrl = async (path: string) => {
    const langFromUrl = extractLanguageFromUrl(path);
    await setLanguageByCode(langFromUrl, false); // Don't update profile when just from URL
  };

  // Get localized URL for a path
  const getLocalizedUrl = (path: string, lang?: string) => {
    const targetLang = lang || currentLanguage;
    return addLanguageToUrl(path, targetLang);
  };

  // Get language from URL
  const getLanguageFromUrl = (path: string) => {
    return extractLanguageFromUrl(path);
  };

  // Initialize language from URL on first load
  useEffect(() => {
    const initLanguage = async () => {
      setLanguageLoading(true);
      
      try {
        // First try from URL
        let finalLanguage = extractLanguageFromUrl(location.pathname);
        
        // If no language in URL, try from user profile or localStorage
        if (!finalLanguage) {
          if (user?.id) {
            const { data } = await supabase
              .from('users')
              .select('language')
              .eq('user_id', user.id)
              .single();
            
            if (data?.language) {
              finalLanguage = data.language;
            }
          } else {
            const savedLang = localStorage.getItem('i18nextLng');
            if (savedLang && supportedLanguages.some(l => l.code === savedLang)) {
              finalLanguage = savedLang;
            }
          }
          
          // If still no language, use browser preference or default
          if (!finalLanguage) {
            finalLanguage = defaultLanguage;
          }
          
          // Update URL with language prefix if needed
          const newPath = addLanguageToUrl(location.pathname, finalLanguage);
          if (newPath !== location.pathname) {
            navigate(newPath + location.search, { replace: true });
          }
        }
        
        // Apply language change
        const langMeta = supportedLanguages.find(l => l.code === finalLanguage);
        if (langMeta) {
          await changeAppLanguage(finalLanguage);
          setCurrentLanguage(finalLanguage);
          setIsRtl(langMeta.rtl);
        }
      } catch (error) {
        console.error('[LANG] Error initializing language:', error);
        // Fallback to default
        await changeAppLanguage(defaultLanguage);
        setCurrentLanguage(defaultLanguage);
        setIsRtl(false);
      } finally {
        setLanguageLoading(false);
      }
    };
    
    initLanguage();
  }, [location.pathname, user, navigate]);

  // Context value
  const value = {
    currentLanguage,
    setLanguageByCode,
    setLanguageByUrl,
    getLocalizedUrl,
    getLanguageFromUrl,
    languageLoading,
    supportedLanguages,
    isRtl,
    ensureNamespaceLoaded,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

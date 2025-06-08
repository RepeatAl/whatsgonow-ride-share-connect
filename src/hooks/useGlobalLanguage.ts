
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { supportedLanguages, defaultLanguage } from '@/config/supportedLanguages';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

const LANGUAGE_STORAGE_KEY = 'i18nextLng';

export const useGlobalLanguage = () => {
  const { i18n } = useTranslation();
  const { user } = useOptimizedAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChanging, setIsChanging] = useState(false);

  // Get current language from URL or i18n
  const getCurrentLanguage = useCallback(() => {
    const urlLang = location.pathname.split('/')[1];
    if (supportedLanguages.some(l => l.code === urlLang)) {
      return urlLang;
    }
    return i18n.language || defaultLanguage;
  }, [location.pathname, i18n.language]);

  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage);

  // Sync language when URL or i18n changes
  useEffect(() => {
    const newLang = getCurrentLanguage();
    if (newLang !== currentLanguage) {
      setCurrentLanguage(newLang);
    }
  }, [getCurrentLanguage, currentLanguage]);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      const urlLang = location.pathname.split('/')[1];
      const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      let targetLang = defaultLanguage;
      
      // Priority: URL > localStorage > default
      if (urlLang && supportedLanguages.some(l => l.code === urlLang)) {
        targetLang = urlLang;
      } else if (storedLang && supportedLanguages.some(l => l.code === storedLang)) {
        targetLang = storedLang;
      }
      
      if (i18n.language !== targetLang) {
        await i18n.changeLanguage(targetLang);
      }
      
      setCurrentLanguage(targetLang);
    };

    initializeLanguage();
  }, [i18n, location.pathname]);

  const changeLanguage = useCallback(async (langCode: string) => {
    if (!supportedLanguages.some(l => l.code === langCode) || isChanging) {
      return false;
    }

    try {
      setIsChanging(true);
      
      // Change i18n language
      await i18n.changeLanguage(langCode);
      
      // Store in localStorage
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
      
      // Update URL with new language
      const currentPath = location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);
      
      // Remove existing language code if present
      if (pathSegments.length > 0 && supportedLanguages.some(l => l.code === pathSegments[0])) {
        pathSegments.shift();
      }
      
      // Build new path with new language
      const newPath = `/${langCode}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`;
      
      // Navigate to new path
      navigate(newPath + location.search, { replace: true });
      
      setCurrentLanguage(langCode);
      
      console.log(`[GlobalLanguage] Changed to: ${langCode}`);
      return true;
    } catch (error) {
      console.error('[GlobalLanguage] Error changing language:', error);
      return false;
    } finally {
      setIsChanging(false);
    }
  }, [i18n, navigate, location, isChanging]);

  const getLanguageInfo = useCallback((langCode?: string) => {
    const code = langCode || currentLanguage;
    return supportedLanguages.find(l => l.code === code) || supportedLanguages[0];
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    isChanging,
    supportedLanguages: supportedLanguages.filter(l => l.implemented),
    getLanguageInfo,
    isRTL: getLanguageInfo().rtl
  };
};

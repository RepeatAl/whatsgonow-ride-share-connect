
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supportedLanguages } from '@/config/supportedLanguages';
import { AppRoutes } from './AppRoutes';

// Helper function to detect user's browser language
const detectBrowserLanguage = (): string => {
  // Navigator languages preference
  const browserLangs = navigator.languages || [navigator.language];
  
  // Try to find a full match first (e.g. de-DE)
  for (const browserLang of browserLangs) {
    const langCode = browserLang.toLowerCase();
    // Check if we support this exact language
    if (supportedLanguages.some(l => l.code === langCode)) {
      return langCode;
    }
  }
  
  // If no exact match, try to match just the language part (e.g. "de" from "de-DE")
  for (const browserLang of browserLangs) {
    const langPart = browserLang.split('-')[0].toLowerCase();
    if (supportedLanguages.some(l => l.code === langPart)) {
      return langPart;
    }
  }
  
  // Default to German if no match
  return 'de';
};

// Helper to extract language code from URL
const extractLanguageFromUrl = (path: string): string | null => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0) {
    const potentialLang = segments[0];
    if (supportedLanguages.some(l => l.code === potentialLang)) {
      return potentialLang;
    }
  }
  return null;
};

// Helper to build a URL with language prefix
const buildLanguageUrl = (path: string, lang: string): string => {
  // Remove any existing language prefix
  const cleanPath = path.replace(/^\/[a-z]{2}(?:\/|$)/, '/');
  
  // Special case for root path
  if (cleanPath === '/') {
    return `/${lang}`;
  }
  
  // Add language prefix to path
  return `/${lang}${cleanPath}`;
};

interface LanguageRouterProps {
  children: React.ReactNode;
}

export const LanguageRouter: React.FC<LanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if URL already contains language code
    const langFromUrl = extractLanguageFromUrl(location.pathname);
    
    if (!langFromUrl) {
      // If no language in URL, determine language to use
      let targetLang;
      
      // First check localStorage (previously selected language)
      const savedLang = localStorage.getItem('i18nextLng');
      if (savedLang && supportedLanguages.some(l => l.code === savedLang)) {
        targetLang = savedLang;
      } else {
        // Fall back to browser language detection
        targetLang = detectBrowserLanguage();
      }
      
      // Redirect to same page with language prefix
      const redirectPath = buildLanguageUrl(location.pathname, targetLang);
      navigate(redirectPath + location.search, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);
  
  // CRITICAL FIX: Render actual routes instead of empty div
  return <AppRoutes />;
};

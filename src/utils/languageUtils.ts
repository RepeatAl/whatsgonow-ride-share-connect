
import { supportedLanguages, defaultLanguage } from '@/config/supportedLanguages';

/**
 * Language utilities for MCP-based language handling
 * Phase 1: Simple, reliable language detection
 */
export const determineBestLanguage = (
  browserLang?: string,
  storedLang?: string | null,
  userProfileLang?: string
): string => {
  // Priority order: user profile -> stored preference -> browser language -> default
  
  // Check user profile language first (highest priority)
  if (userProfileLang && supportedLanguages.some(l => l.code === userProfileLang)) {
    return userProfileLang;
  }
  
  // Check stored language preference
  if (storedLang && supportedLanguages.some(l => l.code === storedLang)) {
    return storedLang;
  }
  
  // Check browser language
  if (browserLang && supportedLanguages.some(l => l.code === browserLang)) {
    return browserLang;
  }
  
  // Fallback to default
  return defaultLanguage;
};

export const isValidLanguageCode = (code: string): boolean => {
  return supportedLanguages.some(l => l.code === code);
};

export const isSupportedLanguage = (code: string): boolean => {
  return supportedLanguages.some(l => l.code === code);
};

export const isImplementedLanguage = (code: string): boolean => {
  return supportedLanguages.some(l => l.code === code && l.implemented);
};

export const getImplementedLanguages = () => {
  return supportedLanguages.filter(l => l.implemented);
};

export const getPlannedLanguages = () => {
  return supportedLanguages.filter(l => !l.implemented);
};

export const getLanguageByCode = (code: string) => {
  return supportedLanguages.find(l => l.code === code);
};

export const validateLanguagePath = (path: string): {
  isValid: boolean;
  languageCode: string | null;
  hasLanguagePrefix: boolean;
  redirectPath?: string;
} => {
  const pathSegments = path.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  
  // Check if first segment is a valid language code
  const isValidLanguage = supportedLanguages.some(l => l.code === firstSegment);
  
  if (isValidLanguage) {
    return {
      isValid: true,
      languageCode: firstSegment,
      hasLanguagePrefix: true
    };
  }
  
  // No valid language prefix found
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return {
    isValid: false,
    languageCode: null,
    hasLanguagePrefix: false,
    redirectPath: `/${defaultLanguage}${cleanPath}`
  };
};

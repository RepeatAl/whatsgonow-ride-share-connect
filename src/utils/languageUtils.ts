
import { supportedLanguages, defaultLanguage } from '@/config/supportedLanguages';

/**
 * Language utilities for MCP-based language handling
 * Phase 1: Simple, reliable language detection
 */
export const determineBestLanguage = (
  browserLang?: string,
  storedLang?: string | null
): string => {
  // Priority order: stored preference -> browser language -> default
  
  // Check stored language preference first
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

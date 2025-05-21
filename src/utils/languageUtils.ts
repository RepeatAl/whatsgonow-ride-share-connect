
import { SupportedLanguage, supportedLanguages } from '@/config/supportedLanguages';
import { defaultLanguage } from '@/contexts/language/constants';

/**
 * Checks if a language is implemented (available for use)
 * @param code - The language code to check
 * @returns True if the language is implemented, false otherwise
 */
export function isImplementedLanguage(code: string): boolean {
  return supportedLanguages.some(lang => lang.code === code && lang.implemented);
}

/**
 * Checks if a language code is supported (either implemented or planned)
 * @param code - The language code to check
 * @returns True if the language is supported, false otherwise
 */
export function isSupportedLanguage(code: string): boolean {
  return supportedLanguages.some(lang => lang.code === code);
}

/**
 * Gets a language object by its code
 * @param code - The language code to look up
 * @returns The language object or undefined if not found
 */
export function getLanguageByCode(code: string): SupportedLanguage | undefined {
  return supportedLanguages.find(lang => lang.code === code);
}

/**
 * Gets a list of all implemented languages
 * @returns Array of implemented language objects
 */
export function getImplementedLanguages(): SupportedLanguage[] {
  return supportedLanguages.filter(lang => lang.implemented);
}

/**
 * Gets a list of all planned (not yet implemented) languages
 * @returns Array of not yet implemented language objects
 */
export function getPlannedLanguages(): SupportedLanguage[] {
  return supportedLanguages.filter(lang => !lang.implemented);
}

/**
 * Determines the best language choice for a user based on various preferences
 * @param browserLang - The browser's language preference
 * @param storedLang - Previously stored language preference
 * @param userProfileLang - Language from user profile
 * @returns The best matching language code
 */
export function determineBestLanguage(
  browserLang?: string | null, 
  storedLang?: string | null, 
  userProfileLang?: string | null
): string {
  // Define the order of preference: user profile > stored preference > browser > default
  
  // Clean up and normalize browser lang to just the language code
  const normalizedBrowserLang = browserLang?.split('-')[0]?.toLowerCase();
  
  // Check if user has explicitly set a language in their profile
  if (userProfileLang && isSupportedLanguage(userProfileLang)) {
    return userProfileLang;
  }
  
  // Check localStorage next
  if (storedLang && isSupportedLanguage(storedLang)) {
    return storedLang;
  }
  
  // Check browser language
  if (normalizedBrowserLang && isSupportedLanguage(normalizedBrowserLang)) {
    return normalizedBrowserLang;
  }
  
  // Return default language as fallback
  return defaultLanguage;
}

/**
 * Validates a URL path with language prefix
 * @param path - The path to validate
 * @returns An object containing validation results
 */
export function validateLanguagePath(path: string): {
  isValid: boolean;
  languageCode: string | null;
  hasLanguagePrefix: boolean;
  redirectPath?: string;
} {
  const segments = path.split('/').filter(Boolean);
  const possibleLang = segments.length > 0 ? segments[0] : null;
  
  // Check if first segment is a language code
  const hasLanguagePrefix = possibleLang !== null && isSupportedLanguage(possibleLang);
  
  return {
    isValid: hasLanguagePrefix,
    languageCode: hasLanguagePrefix ? possibleLang : null,
    hasLanguagePrefix,
    redirectPath: !hasLanguagePrefix ? `/${defaultLanguage}${path === '/' ? '' : path}` : undefined
  };
}

export default {
  isImplementedLanguage,
  isSupportedLanguage,
  getLanguageByCode,
  getImplementedLanguages,
  getPlannedLanguages,
  determineBestLanguage,
  validateLanguagePath
};

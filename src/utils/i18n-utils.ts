
import i18next from 'i18next';
import { loadNamespace } from '@/i18n/i18n';
import { isImplementedLanguage, getLanguageByCode } from '@/utils/languageUtils';
import { supportedLanguages } from '@/config/supportedLanguages';

/**
 * Check if a language is fully implemented with translations
 * @param languageCode The language code to check
 * @param namespaces Optional namespaces to check specifically
 * @returns Boolean indicating whether the language is fully implemented
 */
export const isLanguageImplemented = (
  languageCode: string,
  namespaces?: string[]
): boolean => {
  // If no specific namespaces requested, check if language is in supported list
  if (!namespaces) {
    return isImplementedLanguage(languageCode);
  }

  // Check if all requested namespaces are available for this language
  return namespaces.every((ns) =>
    i18next.hasResourceBundle(languageCode, ns)
  );
};

/**
 * Get the best fallback language for a given language
 * @param languageCode The primary language code
 * @returns The best available fallback language code
 */
export const getFallbackLanguage = (languageCode: string): string => {
  // Default fallback chain
  const fallbackChain: Record<string, string[]> = {
    default: ['de'],
    ar: ['en', 'de'],
    pl: ['en', 'de'],
    fr: ['en', 'de'],
    it: ['en', 'de'],
    es: ['en', 'de'],
  };

  const fallbacks = fallbackChain[languageCode] || fallbackChain.default;
  
  // Return the first implemented fallback
  for (const fallback of fallbacks) {
    if (isImplementedLanguage(fallback)) {
      return fallback;
    }
  }
  
  // Final fallback if none found
  return 'en';
};

/**
 * Safely load namespaces for current or specified language
 * @param namespaces Array of namespace names to load
 * @param language Optional language code (defaults to current)
 * @returns Promise resolving to boolean success indicator
 */
export const safeLoadNamespaces = async (
  namespaces: string | string[],
  language?: string
): Promise<boolean> => {
  try {
    const nsArray = Array.isArray(namespaces) ? namespaces : [namespaces];
    return await loadNamespace(nsArray, language);
  } catch (error) {
    console.error('[i18n-utils] Error loading namespaces:', error);
    return false;
  }
};

/**
 * Get missing translations count for a namespace
 * Useful for analytics/reporting
 */
export const getMissingTranslations = (
  languageCode: string,
  namespace: string
): number => {
  // Implementation would require access to the translation sources
  // This is a placeholder for future implementation
  console.warn('[i18n-utils] getMissingTranslations not fully implemented');
  return 0;
};

export default {
  isLanguageImplemented,
  getFallbackLanguage,
  safeLoadNamespaces,
  getMissingTranslations,
};

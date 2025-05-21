
import { SupportedLanguage, supportedLanguages } from '@/config/supportedLanguages';

/**
 * Checks if a language is implemented (available for use)
 * @param code - The language code to check
 * @returns True if the language is implemented, false otherwise
 */
export function isImplementedLanguage(code: string): boolean {
  return supportedLanguages.some(lang => lang.code === code && lang.implemented);
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

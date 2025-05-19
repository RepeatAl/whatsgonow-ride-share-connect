
import { TFunction } from "i18next";

/**
 * A utility function that ensures i18next translations return strings for Zod validation messages
 * This solves TypeScript errors when i18next translation function returns complex types
 * 
 * @param t The i18next translation function
 * @param key The translation key
 * @param options Optional translation parameters
 * @returns A guaranteed string value for Zod validation messages
 */
export const zodMessage = (
  t: TFunction, 
  key: string, 
  options?: Record<string, any>
): string => {
  const translation = t(key, options);
  return typeof translation === 'string' ? translation : String(translation);
};

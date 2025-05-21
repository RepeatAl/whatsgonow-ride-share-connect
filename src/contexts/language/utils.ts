
import { supportedLanguages } from '@/config/supportedLanguages';
import { defaultLanguage } from './constants';

// Extract language code from URL path
export const extractLanguageFromUrl = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  const possibleLang = segments.length > 0 ? segments[0] : '';
  return supportedLanguages.some(lang => lang.code === possibleLang) ? possibleLang : defaultLanguage;
};

// Remove language code from URL path
export const removeLanguageFromUrl = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  const possibleLang = segments.length > 0 ? segments[0] : '';
  
  if (supportedLanguages.some(lang => lang.code === possibleLang)) {
    // Remove language segment and return path
    return '/' + segments.slice(1).join('/');
  }
  
  // No language in URL, return original
  return path;
};

// Add language code to URL path
export const addLanguageToUrl = (path: string, lang: string): string => {
  // First remove any existing language code
  const cleanPath = removeLanguageFromUrl(path);
  // Handle home page special case
  if (cleanPath === '/') {
    return `/${lang}`;
  }
  return `/${lang}${cleanPath}`;
};

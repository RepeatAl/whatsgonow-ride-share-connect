
export interface SupportedLanguage {
  code: string;
  name: string;
  localName: string;
  flag: string;
  rtl?: boolean;
  implemented: boolean;
}

export const supportedLanguages: SupportedLanguage[] = [
  {
    code: 'de',
    name: 'German',
    localName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    implemented: true,
  },
  {
    code: 'en',
    name: 'English',
    localName: 'English',
    flag: '🇺🇸',
    rtl: false,
    implemented: true,
  },
  {
    code: 'ar',
    name: 'Arabic',
    localName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    implemented: true,
  },
];

export const defaultLanguage = 'de';

// Extract just the language codes for easy validation
export const languageCodes = supportedLanguages.map(lang => lang.code);

console.log('[CONFIG] Supported languages loaded:', languageCodes);
console.log('[CONFIG] Default language:', defaultLanguage);

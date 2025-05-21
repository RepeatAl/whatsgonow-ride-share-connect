
// Define the structure for a supported language
export interface SupportedLanguage {
  code: string;      // ISO 639-1 language code
  name: string;      // Display name in English
  flag: string;      // Emoji flag representation
  rtl: boolean;      // Right-to-left text direction
  localName?: string; // Name in the language itself
  implemented: boolean; // Whether language is fully implemented
}

// List of supported languages 
export const supportedLanguages: SupportedLanguage[] = [
  { 
    code: 'de', 
    name: 'German', 
    flag: '🇩🇪', 
    rtl: false,
    localName: 'Deutsch',
    implemented: true
  },
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇬🇧', 
    rtl: false,
    localName: 'English',
    implemented: true
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    flag: '🇸🇦', 
    rtl: true,
    localName: 'العربية',
    implemented: true 
  },
  { 
    code: 'fr', 
    name: 'French', 
    flag: '🇫🇷', 
    rtl: false,
    localName: 'Français',
    implemented: false
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    flag: '🇪🇸', 
    rtl: false,
    localName: 'Español',
    implemented: false
  },
  { 
    code: 'it', 
    name: 'Italian', 
    flag: '🇮🇹', 
    rtl: false,
    localName: 'Italiano',
    implemented: false
  },
  { 
    code: 'tr', 
    name: 'Turkish', 
    flag: '🇹🇷', 
    rtl: false,
    localName: 'Türkçe',
    implemented: false
  },
  { 
    code: 'pl', 
    name: 'Polish', 
    flag: '🇵🇱', 
    rtl: false,
    localName: 'Polski',
    implemented: false
  }
];

// Export language codes for easy access
export const languageCodes = supportedLanguages.map(lang => lang.code);

// Get implemented languages
export const implementedLanguages = supportedLanguages
  .filter(lang => lang.implemented)
  .map(lang => lang.code);

// Default language
export const defaultLanguage = 'de';

export default supportedLanguages;

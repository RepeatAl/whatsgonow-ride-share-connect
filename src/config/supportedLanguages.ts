
// Define the structure for a supported language
export interface SupportedLanguage {
  code: string;      // ISO 639-1 language code
  name: string;      // Display name in English
  localName: string; // Name in the language itself
  flag: string;      // Emoji flag representation
  rtl?: boolean;     // Right-to-left text direction
  implemented: boolean; // Whether language is fully implemented
}

// List of supported languages 
export const supportedLanguages: SupportedLanguage[] = [
  // Currently implemented languages
  { 
    code: "de", 
    name: "German", 
    localName: "Deutsch",
    flag: "🇩🇪", 
    rtl: false,
    implemented: true
  },
  { 
    code: "en", 
    name: "English", 
    localName: "English",
    flag: "🇬🇧", 
    rtl: false,
    implemented: true
  },
  { 
    code: "ar", 
    name: "Arabic", 
    localName: "العربية",
    flag: "🇸🇦", 
    rtl: true,
    implemented: true 
  },
  
  // Languages planned for future implementation
  { 
    code: "fr", 
    name: "French", 
    localName: "Français",
    flag: "🇫🇷", 
    rtl: false,
    implemented: false
  },
  { 
    code: "es", 
    name: "Spanish", 
    localName: "Español",
    flag: "🇪🇸", 
    rtl: false,
    implemented: false
  },
  { 
    code: "it", 
    name: "Italian", 
    localName: "Italiano",
    flag: "🇮🇹", 
    rtl: false,
    implemented: false
  },
  { 
    code: "tr", 
    name: "Turkish", 
    localName: "Türkçe",
    flag: "🇹🇷", 
    rtl: false,
    implemented: false
  },
  { 
    code: "pl", 
    name: "Polish", 
    localName: "Polski",
    flag: "🇵🇱", 
    rtl: false,
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

// Validation check for duplicate language codes (dev mode only)
if (process.env.NODE_ENV === 'development') {
  const codeSet = new Set<string>();
  let hasDuplicates = false;
  
  supportedLanguages.forEach(lang => {
    if (codeSet.has(lang.code)) {
      console.error(`[LANGUAGE CONFIG] Duplicate language code found: ${lang.code}`);
      hasDuplicates = true;
    }
    codeSet.add(lang.code);
    
    if (!lang.implemented) {
      console.info(`[LANGUAGE CONFIG] Language "${lang.name}" (${lang.code}) is marked as not implemented yet`);
    }
  });
  
  if (hasDuplicates) {
    console.error('[LANGUAGE CONFIG] Fix duplicate language codes - this will cause issues!');
  }
}

export default supportedLanguages;

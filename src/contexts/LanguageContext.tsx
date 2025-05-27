
// DEPRECATED: This file is maintained for backward compatibility only
// New code should use @/mcp/language/LanguageMCP directly

import { useLanguageMCP, LanguageMCPProvider } from '@/mcp/language/LanguageMCP';

// Re-export the MCP hook for backward compatibility
export const useLanguage = useLanguageMCP;

// For any remaining legacy imports, redirect to MCP
export { LanguageMCPProvider as LanguageProvider };

// Re-export the context type for backward compatibility - mapped from MCP
export interface LanguageContextType {
  currentLanguage: string;
  setLanguageByCode: (lang: string, storeInProfile?: boolean) => Promise<void>;
  getLocalizedUrl: (path: string, lang?: string) => string;
  languageLoading: boolean;
  supportedLanguages: any[];
  isRtl: boolean;
}

console.warn('[DEPRECATED] LanguageContext is deprecated. Use @/mcp/language/LanguageMCP instead.');

export default { LanguageProvider: LanguageMCPProvider, useLanguage: useLanguageMCP };

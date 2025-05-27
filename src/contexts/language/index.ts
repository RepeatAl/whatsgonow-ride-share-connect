
// DEPRECATED: This entire module is deprecated in favor of MCP architecture
// Use @/mcp/language/LanguageMCP instead

console.warn('[DEPRECATED] @/contexts/language/* is deprecated. Use @/mcp/language/LanguageMCP instead.');

export { LanguageMCPProvider as LanguageProvider, useLanguageMCP as useLanguage } from '@/mcp/language/LanguageMCP';
export type { LanguageContextType } from './types';
export { extractLanguageFromUrl, removeLanguageFromUrl, addLanguageToUrl } from './utils';
export { defaultLanguage } from './constants';

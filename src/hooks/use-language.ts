
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { safeLoadNamespaces } from '@/utils/i18n-utils';

export const useLanguage = () => {
  const context = useLanguageMCP();
  
  // For backward compatibility, map the context to the old interface
  return {
    changeLanguage: context.setLanguageByCode,
    currentLanguage: context.currentLanguage,
    loading: context.languageLoading,
    isRtl: context.isRtl,
    // Add new functionality
    ensureNamespaces: safeLoadNamespaces,
    getLocalizedUrl: context.getLocalizedUrl,
    // Map all other properties directly
    ...context
  };
};

export default useLanguage;

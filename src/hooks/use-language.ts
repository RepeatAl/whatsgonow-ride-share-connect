
import { useLanguage as useLanguageContext } from '@/contexts/LanguageContext';
import { safeLoadNamespaces } from '@/utils/i18n-utils';

export const useLanguage = () => {
  const context = useLanguageContext();
  
  // For backward compatibility, map the context to the old interface
  return {
    changeLanguage: context.setLanguageByCode,
    currentLanguage: context.currentLanguage,
    loading: context.languageLoading,
    isRtl: context.isRtl,
    // Add new functionality
    ensureNamespaces: safeLoadNamespaces,
    getLocalizedUrl: context.getLocalizedUrl
  };
};

export default useLanguage;

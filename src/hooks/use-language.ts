
import { useLanguage as useLanguageContext } from '@/contexts/LanguageContext';

export const useLanguage = () => {
  const context = useLanguageContext();
  
  // For backward compatibility, map the context to the old interface
  return {
    changeLanguage: context.setLanguageByCode,
    currentLanguage: context.currentLanguage,
    loading: context.languageLoading,
    isRtl: context.isRtl,
  };
};

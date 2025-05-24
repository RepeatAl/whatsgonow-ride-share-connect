
import { useState, useEffect } from 'react';
import { useUserSession } from '@/contexts/UserSessionContext';
import { useLanguage } from '@/contexts/language';
import { loadNamespace } from '@/i18n/i18n';

export interface AppInitializationState {
  isReady: boolean;
  isLoading: boolean;
  authReady: boolean;
  languageReady: boolean;
  translationsReady: boolean;
}

export const useAppInitialization = (requiredNamespaces: string[] = ['common']) => {
  const [state, setState] = useState<AppInitializationState>({
    isReady: false,
    isLoading: true,
    authReady: false,
    languageReady: false,
    translationsReady: false
  });

  const { loading: authLoading, isInitialLoad } = useUserSession();
  const { languageLoading, currentLanguage } = useLanguage();

  useEffect(() => {
    const initializeApp = async () => {
      console.log('[App Init] Starting initialization...');
      
      // Wait for auth to be ready
      const authReady = !authLoading && !isInitialLoad;
      
      // Wait for language to be ready - check if currentLanguage exists and is not empty
      const languageReady = !languageLoading && !!currentLanguage;
      
      // Load required translations
      let translationsReady = false;
      if (languageReady) {
        try {
          console.log('[App Init] Loading namespaces:', requiredNamespaces);
          await loadNamespace(requiredNamespaces, currentLanguage);
          translationsReady = true;
          console.log('[App Init] Translations loaded successfully');
        } catch (error) {
          console.error('[App Init] Failed to load translations:', error);
          translationsReady = true; // Continue anyway with fallbacks
        }
      }

      const isReady = authReady && languageReady && translationsReady;
      
      setState({
        isReady,
        isLoading: !isReady,
        authReady,
        languageReady,
        translationsReady
      });

      console.log('[App Init] State updated:', {
        authReady,
        languageReady,
        translationsReady,
        isReady
      });
    };

    initializeApp();
  }, [authLoading, isInitialLoad, languageLoading, currentLanguage, requiredNamespaces.join(',')]);

  return state;
};

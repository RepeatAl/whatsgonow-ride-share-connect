
import { useState, useEffect } from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { loadNamespace } from '@/i18n/i18n';

export interface AppInitializationState {
  isReady: boolean;
  isLoading: boolean;
  authReady: boolean;
  languageReady: boolean;
  translationsReady: boolean;
}

export const useAppInitialization = (requiredNamespaces: string[] = ['common'], requireAuth: boolean = true) => {
  const [state, setState] = useState<AppInitializationState>({
    isReady: false,
    isLoading: true,
    authReady: false,
    languageReady: false,
    translationsReady: false
  });

  const { loading: authLoading } = useOptimizedAuth();
  const { languageLoading, currentLanguage } = useLanguageMCP();

  useEffect(() => {
    const initializeApp = async () => {
      console.log('[App Init] Starting initialization...');
      
      // Wait for auth to be ready (only if required)
      const authReady = requireAuth ? !authLoading : true;
      
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
        isReady,
        requireAuth
      });
    };

    initializeApp();
  }, [authLoading, languageLoading, currentLanguage, requiredNamespaces.join(','), requireAuth]);

  return state;
};

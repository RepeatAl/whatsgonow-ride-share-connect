
import { useState, useEffect, useMemo } from 'react';
import { useUserSession } from '@/contexts/UserSessionContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { loadNamespace } from '@/i18n/i18n';

export interface StableAppState {
  isReady: boolean;
  isLoading: boolean;
  authReady: boolean;
  languageReady: boolean;
  translationsReady: boolean;
  hasMinimumLoadTime: boolean;
}

interface UseStableAppStateOptions {
  requiredNamespaces?: string[];
  requireAuth?: boolean;
  minimumLoadTime?: number;
}

export const useStableAppState = (options: UseStableAppStateOptions = {}) => {
  const {
    requiredNamespaces = ['common'],
    requireAuth = false,
    minimumLoadTime = 300 // Minimum 300ms to prevent flashing
  } = options;

  const [state, setState] = useState<StableAppState>({
    isReady: false,
    isLoading: true,
    authReady: false,
    languageReady: false,
    translationsReady: false,
    hasMinimumLoadTime: false
  });

  const { loading: authLoading, isInitialLoad } = useUserSession();
  const { languageLoading, currentLanguage } = useLanguageMCP();

  // Track minimum load time to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        hasMinimumLoadTime: true
      }));
    }, minimumLoadTime);

    return () => clearTimeout(timer);
  }, [minimumLoadTime]);

  // Memoize the initialization logic
  const initializationPromise = useMemo(() => {
    return async () => {
      console.log('[StableApp] Starting initialization...');
      
      // Wait for auth to be ready (only if required)
      const authReady = requireAuth ? (!authLoading && !isInitialLoad) : true;
      
      // Wait for language to be ready
      const languageReady = !languageLoading && !!currentLanguage;
      
      // Load required translations
      let translationsReady = false;
      if (languageReady && currentLanguage) {
        try {
          console.log('[StableApp] Loading namespaces:', requiredNamespaces);
          await loadNamespace(requiredNamespaces, currentLanguage);
          translationsReady = true;
          console.log('[StableApp] Translations loaded successfully');
        } catch (error) {
          console.error('[StableApp] Failed to load translations:', error);
          translationsReady = true; // Continue anyway with fallbacks
        }
      }

      return {
        authReady,
        languageReady,
        translationsReady
      };
    };
  }, [authLoading, isInitialLoad, languageLoading, currentLanguage, requiredNamespaces.join(','), requireAuth]);

  // Run initialization when dependencies change
  useEffect(() => {
    initializationPromise().then(({ authReady, languageReady, translationsReady }) => {
      setState(prev => {
        const isReady = authReady && languageReady && translationsReady && prev.hasMinimumLoadTime;
        
        return {
          isReady,
          isLoading: !isReady,
          authReady,
          languageReady,
          translationsReady,
          hasMinimumLoadTime: prev.hasMinimumLoadTime
        };
      });

      console.log('[StableApp] State updated:', {
        authReady,
        languageReady,
        translationsReady,
        requireAuth
      });
    });
  }, [initializationPromise]);

  return state;
};

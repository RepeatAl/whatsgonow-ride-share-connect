
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enAnalytics from './locales/en/analytics.json';
import enFeedback from './locales/en/feedback.json';
import enPreRegister from './locales/en/pre_register.json';
import enErrors from './locales/en/errors.json';
import enLanding from './locales/en/landing.json';
import enFaq from './locales/en/faq.json';

// Import German translations
import deCommon from './locales/de/common.json';
import deAuth from './locales/de/auth.json';
import deDashboard from './locales/de/dashboard.json';
import deAnalytics from './locales/de/analytics.json';
import deFeedback from './locales/de/feedback.json';
import dePreRegister from './locales/de/pre_register.json';
import deErrors from './locales/de/errors.json';
import deLanding from './locales/de/landing.json';
import deFaq from './locales/de/faq.json';

// Import Arabic translations
import arCommon from './locales/ar/common.json';
import arFaq from './locales/ar/faq.json';
import arLanding from './locales/ar/landing.json';
import arPreRegister from './locales/ar/pre_register.json';
import arErrors from './locales/ar/errors.json';

// Configure namespaces for each feature
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    analytics: enAnalytics,
    feedback: enFeedback,
    pre_register: enPreRegister,
    errors: enErrors,
    landing: enLanding,
    faq: enFaq
  },
  de: {
    common: deCommon,
    auth: deAuth,
    dashboard: deDashboard,
    analytics: deAnalytics,
    feedback: deFeedback,
    pre_register: dePreRegister,
    errors: deErrors,
    landing: deLanding,
    faq: deFaq
  },
  ar: {
    common: arCommon,
    faq: arFaq,
    landing: arLanding,
    pre_register: arPreRegister,
    errors: arErrors,
    // Add fallbacks for missing namespaces
    auth: enAuth,
    dashboard: enDashboard,
    analytics: enAnalytics,
    feedback: enFeedback
  }
};

// Define namespaces that are preloaded vs lazy-loaded
const PRELOADED_NAMESPACES = ['common', 'errors'];
const LAZY_NAMESPACES = ['landing', 'auth', 'dashboard', 'analytics', 'feedback', 'pre_register', 'faq'];
const ALL_NAMESPACES = [...PRELOADED_NAMESPACES, ...LAZY_NAMESPACES];

// Track loaded namespaces
const loadedNamespaces: Record<string, boolean> = {};
PRELOADED_NAMESPACES.forEach(ns => loadedNamespaces[ns] = true);

// Initialize i18n directly - don't wait for async operations
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: {
      'default': ['de'],
      'ar': ['en', 'de'],
      'pl': ['en', 'de'],
      'fr': ['en', 'de'],
      'it': ['en', 'de'],
      'es': ['en', 'de'],
    },
    lng: 'de', // Explicitly set German as default language
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    ns: ALL_NAMESPACES,
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded', // Make sure components refresh when language changes
      bindI18nStore: 'added removed', // React to resource changes
      transEmptyNodeValue: '', // Value for empty translations
      transSupportBasicHtmlNodes: true, // Support for basic HTML in translations
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'b'], // Keep these HTML nodes
    },
    // Initialize with only preloaded namespaces
    initImmediate: true, // This ensures all resources are loaded before rendering
    partialBundledLanguages: true,
  });

// Function to load a namespace on demand
export const loadNamespace = async (namespace: string | string[], language?: string) => {
  const namespaces = Array.isArray(namespace) ? namespace : [namespace];
  const currentLang = language || i18n.language;
  
  try {
    await Promise.all(namespaces.map(async ns => {
      if (!loadedNamespaces[ns]) {
        await i18n.loadNamespaces(ns);
        loadedNamespaces[ns] = true;
      }
    }));
    
    return true;
  } catch (error) {
    console.error(`[i18n] Failed to load namespaces: ${namespaces.join(', ')}`, error);
    return false;
  }
};

// Debug logging for i18n in development mode
if (process.env.NODE_ENV === 'development') {
  i18n.on('initialized', () => {
    console.log('[i18n] Initialization complete');
    console.log('[i18n] Current language:', i18n.language);
    console.log('[i18n] RTL mode:', i18n.language === 'ar');
    console.log('[i18n] Available languages:', Object.keys(resources));
    console.log('[i18n] Preloaded namespaces:', PRELOADED_NAMESPACES);
    console.log('[i18n] Lazy namespaces:', LAZY_NAMESPACES);
  });

  i18n.on('languageChanged', (lng) => {
    console.log('[i18n] Language changed to:', lng);
    console.log('[i18n] RTL mode:', lng === 'ar');
    console.log('[i18n] Document direction:', document.documentElement.dir);
    console.log('[i18n] localStorage value:', localStorage.getItem('i18nextLng'));
    
    // Log loaded namespaces for debugging
    ALL_NAMESPACES.forEach(ns => {
      console.log(`[i18n] Namespace '${ns}' loaded:`, i18n.hasResourceBundle(lng, ns));
    });
  });
  
  i18n.on('loaded', (loaded) => {
    console.log('[i18n] Resources loaded:', loaded);
  });

  i18n.on('failedLoading', (lng, ns, msg) => {
    console.error(`[i18n] Failed loading ${lng}/${ns}: ${msg}`);
  });
}

// Export i18n instance and the loadNamespace function
export default i18n;

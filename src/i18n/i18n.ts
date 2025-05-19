
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
    faq: arFaq
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'de',
    lng: 'de', // Explicitly set German as default language
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    ns: ['common', 'auth', 'dashboard', 'analytics', 'feedback', 'pre_register', 'errors', 'landing', 'faq'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

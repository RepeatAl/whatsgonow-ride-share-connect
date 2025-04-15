
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import deTranslation from './locales/de/translation.json';
import enTranslation from './locales/en/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        translation: deTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

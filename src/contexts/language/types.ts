
import { supportedLanguages } from '@/config/supportedLanguages';

export interface LanguageContextType {
  currentLanguage: string;
  setLanguageByCode: (lang: string, storeInProfile?: boolean) => Promise<void>;
  setLanguageByUrl: (path: string) => Promise<void>;
  getLocalizedUrl: (path: string, lang?: string) => string;
  getLanguageFromUrl: (path: string) => string;
  languageLoading: boolean;
  supportedLanguages: typeof supportedLanguages;
  isRtl: boolean;
  ensureNamespaceLoaded: (namespace: string | string[]) => Promise<void>;
}

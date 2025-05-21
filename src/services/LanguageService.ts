
import i18n from '@/i18n/i18n';
import { supportedLanguages } from '@/config/supportedLanguages';

export const changeAppLanguage = async (lang: string) => {
  const languageMeta = supportedLanguages.find(l => l.code === lang);
  const dir = languageMeta?.rtl ? 'rtl' : 'ltr';

  document.documentElement.dir = dir;
  document.body.dir = dir;
  localStorage.setItem('i18nextLng', lang);

  // Ensure core namespaces are loaded
  const defaultNamespaces = ['common', 'landing', 'faq', 'pre_register', 'errors'];
  await i18n.loadNamespaces(defaultNamespaces);
  
  try {
    await i18n.changeLanguage(lang);
    console.log(`[LANG] Changed language to: ${lang}, RTL: ${dir === 'rtl'}`);
    return lang;
  } catch (error) {
    console.error(`[LANG] Error changing language to ${lang}:`, error);
    throw error;
  }
};

export default changeAppLanguage;

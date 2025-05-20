
import i18n from '@/i18n/i18n';
import { supportedLanguages } from '@/config/supportedLanguages';

export const changeAppLanguage = async (lang: string) => {
  const languageMeta = supportedLanguages.find(l => l.code === lang);
  const dir = languageMeta?.rtl ? 'rtl' : 'ltr';

  document.documentElement.dir = dir;
  document.body.dir = dir;
  localStorage.setItem('i18nextLng', lang);

  const defaultNamespaces = ['common', 'landing', 'faq', 'pre_register', 'errors'];
  await i18n.loadNamespaces(defaultNamespaces);
  await i18n.changeLanguage(lang);

  return lang;
};

export default changeAppLanguage;

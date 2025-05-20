
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const updateUserLanguage = async (lang: string) => {
    if (user?.id) {
      try {
        await supabase
          .from('users')
          .update({ language: lang })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('[LANG-ERROR] Failed to update user language in database:', error);
      }
    }
  };

  useEffect(() => {
    const initLanguage = async () => {
      try {
        setLoading(true);
        // Get the language from localStorage first as a fallback
        const savedLang = localStorage.getItem('i18nextLng');
        console.log('[LANG-INIT] Initial saved language from localStorage:', savedLang);
        
        let finalLanguage = savedLang || 'de';
        
        if (user?.id) {
          const { data } = await supabase
            .from('users')
            .select('language')
            .eq('user_id', user.id)
            .single();

          if (data?.language) {
            console.log('[LANG-INIT] Found language in user profile:', data.language);
            finalLanguage = data.language;
          }
        }
        
        // Ensure landing namespace is loaded for the language
        await i18n.loadNamespaces(['landing', 'common', 'faq', 'pre_register']);
        
        // Then change language if needed
        if (i18n.language !== finalLanguage) {
          await i18n.changeLanguage(finalLanguage);
        }
        
        // Set the HTML dir attribute based on language
        document.documentElement.dir = finalLanguage === 'ar' ? 'rtl' : 'ltr';
        document.body.dir = finalLanguage === 'ar' ? 'rtl' : 'ltr';
        
        // Update localStorage
        localStorage.setItem('i18nextLng', finalLanguage);
        
        console.log('[LANG-INIT] Language initialized to:', finalLanguage);
        console.log('[LANG-INIT] Document direction set to:', document.documentElement.dir);
        console.log('[LANG-INIT] Landing namespace loaded:', i18n.hasResourceBundle(finalLanguage, 'landing'));
      } catch (error) {
        console.error('[LANG-ERROR] Failed to initialize language:', error);
      } finally {
        setLoading(false);
      }
    };

    initLanguage();
  }, [user, i18n]);

  const changeLanguage = async (lang: string) => {
    setLoading(true);
    
    try {
      console.log('[LANG-CHANGE] Changing language to:', lang);
      
      // Force update localStorage first
      localStorage.setItem('i18nextLng', lang);
      
      // Set the HTML dir attribute based on language
      const newDir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = newDir;
      document.body.dir = newDir;
      
      // Preload namespaces needed for landing page and other critical pages
      await i18n.loadNamespaces(['landing', 'common', 'faq', 'pre_register']);
      
      // Then change the language in i18n
      await i18n.changeLanguage(lang);
      
      // Update user profile if logged in
      await updateUserLanguage(lang);
      
      console.log('[LANG-CHANGE] Language changed successfully to:', lang);
      console.log('[LANG-CHANGE] Document direction:', document.documentElement.dir);
      console.log('[LANG-CHANGE] i18n.language:', i18n.language);
      console.log('[LANG-CHANGE] localStorage i18nextLng:', localStorage.getItem('i18nextLng'));
      console.log('[LANG-CHANGE] Landing namespace loaded:', i18n.hasResourceBundle(lang, 'landing'));
      
      return true;
    } catch (error) {
      console.error('[LANG-ERROR] Error changing language:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { changeLanguage, currentLanguage: i18n.language, loading };
};


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
        if (user?.id) {
          const { data } = await supabase
            .from('users')
            .select('language')
            .eq('user_id', user.id)
            .single();

          if (data?.language) {
            await i18n.changeLanguage(data.language);
            
            // Set the HTML dir attribute based on language
            document.documentElement.dir = data.language === 'ar' ? 'rtl' : 'ltr';
            console.log('[LANG-INIT] Set language from user profile:', data.language);
            console.log('[LANG-INIT] Set document direction:', document.documentElement.dir);
          }
        } else {
          // If no user, ensure we still have the correct direction from localStorage
          const savedLang = localStorage.getItem('i18nextLng');
          if (savedLang === 'ar') {
            document.documentElement.dir = 'rtl';
            console.log('[LANG-INIT] Set RTL from localStorage for non-logged-in user');
          }
        }
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
      await i18n.changeLanguage(lang);
      await updateUserLanguage(lang);
      
      // Set the HTML dir attribute based on language
      const newDir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = newDir;
      
      // Force update localStorage to ensure it's set correctly
      localStorage.setItem('i18nextLng', lang);
      
      console.log('[LANG-CHANGE] Language changed successfully');
      console.log('[LANG-CHANGE] Document direction:', document.documentElement.dir);
      console.log('[LANG-CHANGE] i18n.language:', i18n.language);
      
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

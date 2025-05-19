
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
      await supabase
        .from('users')
        .update({ language: lang })
        .eq('user_id', user.id);
    }
  };

  useEffect(() => {
    const initLanguage = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('users')
          .select('language')
          .eq('user_id', user.id)
          .single();

        if (data?.language) {
          await i18n.changeLanguage(data.language);
        }
      }
      setLoading(false);
    };

    initLanguage();
  }, [user, i18n]);

  const changeLanguage = async (lang: string) => {
    setLoading(true);
    
    try {
      await i18n.changeLanguage(lang);
      await updateUserLanguage(lang);
      
      // Set the HTML dir attribute based on language
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      // Debug logging for Arabic language in development mode
      if (process.env.NODE_ENV === 'development' && lang === 'ar') {
        console.log('[DEBUG] Sprache auf Arabisch gesetzt');
        console.log('[DEBUG] document.dir:', document.documentElement.dir);
        console.log('[DEBUG] i18n.language:', i18n.language);
        console.log('[DEBUG] Components should re-render with RTL support');
      }
    } finally {
      setLoading(false);
    }
  };

  return { changeLanguage, currentLanguage: i18n.language, loading };
};


import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const LanguageToggle = () => {
  const { changeLanguage, currentLanguage, loading } = useLanguage();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    // If we determined a reload is needed (especially for RTL changes)
    if (shouldReload) {
      setShouldReload(false);
      
      // Debug information before reload
      console.log('[LANG-DEBUG] Initiating page reload for language change');
      console.log('[LANG-DEBUG] Current language:', currentLanguage);
      console.log('[LANG-DEBUG] Current document dir:', document.documentElement.dir);
      console.log('[LANG-DEBUG] LocalStorage i18nextLng:', localStorage.getItem('i18nextLng'));
      
      // Ensure localStorage is updated before reloading
      localStorage.setItem('i18nextLng', currentLanguage);
      
      // Force i18n to load resources before reloading
      i18n.loadNamespaces(['landing', 'common'], () => {
        console.log('[LANG-DEBUG] Required namespaces preloaded before reload');
        
        // Add a flag in sessionStorage to indicate we're coming from a language change
        sessionStorage.setItem('langSwitchTimestamp', Date.now().toString());
      
        // Increased delay to ensure language and direction are saved properly
        setTimeout(() => {
          console.log('[LANG-DEBUG] Executing reload now');
          window.location.reload();
        }, 600);
      });
    }
  }, [shouldReload, currentLanguage, i18n]);

  const handleLanguageChange = async (lang: string) => {
    if (currentLanguage === lang) return;
    
    try {
      console.log('[LANG-DEBUG] Language change requested:', lang);
      console.log('[LANG-DEBUG] Current language before change:', currentLanguage);
      
      await changeLanguage(lang);
      
      console.log('[LANG-DEBUG] Language changed to:', lang);
      console.log('[LANG-DEBUG] Document direction after change:', document.documentElement.dir);
      console.log('[LANG-DEBUG] LocalStorage after change:', localStorage.getItem('i18nextLng'));
      console.log('[LANG-DEBUG] Landing namespace loaded:', i18n.hasResourceBundle(lang, 'landing'));
      
      // Always reload for language changes to ensure all components re-render properly
      // This is especially important for RTL language changes
      setShouldReload(true);
      
      toast({
        description: 
          lang === 'de' ? "Sprache wurde auf Deutsch geändert" : 
          lang === 'en' ? "Language changed to English" :
          "تم تغيير اللغة إلى العربية",
      });
    } catch (error) {
      console.error('[LANG-DEBUG] Language change error:', error);
      toast({
        variant: "destructive",
        description: 
          lang === 'de' ? "Fehler beim Ändern der Sprache" : 
          lang === 'en' ? "Error changing language" :
          "خطأ في تغيير اللغة",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={loading}
          className="flex items-center gap-2 h-9 px-3 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Change language"
        >
          {currentLanguage === 'de' ? (
            <>
              <span className="mr-1">🇩🇪</span>
              <span className="hidden sm:inline">Deutsch</span>
            </>
          ) : currentLanguage === 'en' ? (
            <>
              <span className="mr-1">🇬🇧</span>
              <span className="hidden sm:inline">English</span>
            </>
          ) : (
            <>
              <span className="mr-1">🇸🇦</span>
              <span className="hidden sm:inline">العربية</span>
            </>
          )}
          {loading && (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent ml-1" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] bg-background">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('de')}
          className={`cursor-pointer ${currentLanguage === 'de' ? 'bg-accent' : ''}`}
        >
          <span className="mr-2">🇩🇪</span>
          Deutsch 
          {currentLanguage === 'de' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={`cursor-pointer ${currentLanguage === 'en' ? 'bg-accent' : ''}`}
        >
          <span className="mr-2">🇬🇧</span>
          English
          {currentLanguage === 'en' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ar')}
          className={`cursor-pointer ${currentLanguage === 'ar' ? 'bg-accent' : ''}`}
          data-testid="arabic-language-option"
        >
          <span className="mr-2">🇸🇦</span>
          العربية
          {currentLanguage === 'ar' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

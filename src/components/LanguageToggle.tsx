
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
  const { t } = useTranslation();
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    // If we determined a reload is needed (especially for RTL changes)
    if (shouldReload) {
      setShouldReload(false);
      if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG] Reloading page to ensure proper RTL rendering');
      }
      // Small delay to ensure language is saved in localStorage
      setTimeout(() => window.location.reload(), 100);
    }
  }, [shouldReload]);

  const handleLanguageChange = async (lang: string) => {
    if (currentLanguage === lang) return;
    
    try {
      await changeLanguage(lang);
      
      // If switching to/from Arabic, we may need a full reload for proper RTL
      const needsReload = (currentLanguage === 'ar' || lang === 'ar');
      
      toast({
        description: 
          lang === 'de' ? "Sprache wurde auf Deutsch geändert" : 
          lang === 'en' ? "Language changed to English" :
          "تم تغيير اللغة إلى العربية",
      });
      
      if (needsReload) {
        setShouldReload(true);
      }
    } catch (error) {
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

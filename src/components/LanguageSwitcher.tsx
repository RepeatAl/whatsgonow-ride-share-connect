
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Check, Globe, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getImplementedLanguages, getPlannedLanguages, isImplementedLanguage } from "@/utils/languageUtils";

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "compact";
  showLabel?: boolean;
}

export const LanguageSwitcher = ({
  variant = "default",
  showLabel = true,
}: LanguageSwitcherProps) => {
  const { currentLanguage, setLanguageByCode, languageLoading, supportedLanguages } = useLanguage();
  const { toast } = useToast();
  const { t, ready } = useTranslation("common");
  const [isChanging, setIsChanging] = useState(false);

  // Get current language metadata
  const currentLangMeta = supportedLanguages.find(l => l.code === currentLanguage) || 
    { code: 'de', name: 'Deutsch', localName: 'Deutsch', flag: '🇩🇪', rtl: false, implemented: true };

  // Handle language change
  const handleLanguageChange = async (langCode: string) => {
    if (currentLanguage === langCode || isChanging) return;
    
    try {
      setIsChanging(true);
      
      await setLanguageByCode(langCode, true);
      
      toast({
        description: t("language_changed", { language: supportedLanguages.find(l => l.code === langCode)?.name }),
      });
    } catch (error) {
      console.error('[LANG-SWITCH] Error changing language:', error);
      toast({
        variant: "destructive",
        description: t("language_change_error"),
      });
    } finally {
      setIsChanging(false);
    }
  };

  // Get available and future languages
  const availableLanguages = getImplementedLanguages();
  const futureLanguages = getPlannedLanguages();

  // If translations aren't ready yet, show a loading state
  if (!ready) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        disabled
        className="h-9 opacity-70"
      >
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === "compact" ? "ghost" : variant === "outline" ? "outline" : "default"}
          size={variant === "compact" ? "icon" : "sm"}
          className={variant === "compact" ? "w-8 h-8 p-0" : "h-9 px-3 gap-2"}
          disabled={languageLoading || isChanging}
          aria-label={t("change_language")}
        >
          {variant === "compact" ? (
            <Globe className="h-4 w-4" />
          ) : (
            <>
              <span className="mr-1">{currentLangMeta.flag}</span>
              {showLabel && <span className="hidden sm:inline">{currentLangMeta.name}</span>}
              {(languageLoading || isChanging) && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent ml-1" />
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] max-h-[70vh] overflow-auto">
        <DropdownMenuLabel>{t("select_language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="max-h-[50vh]">
          {/* Available Languages */}
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer flex items-center justify-between ${
                currentLanguage === lang.code ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="mr-1">{lang.flag}</span>
                <span className={lang.rtl ? "font-rtl" : ""}>{lang.name}</span>
                {lang.code !== 'de' && lang.code !== 'en' && !isImplementedLanguage(lang.code) && (
                  <span className="text-xs text-muted-foreground ml-1">{t("partial")}</span>
                )}
              </div>
              {currentLanguage === lang.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}

          {/* Separator for future languages */}
          {futureLanguages.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">{t("coming_soon")}</DropdownMenuLabel>
            </>
          )}

          {/* Future Languages (Coming Soon) */}
          {futureLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              disabled
              className="cursor-not-allowed opacity-50"
            >
              <div className="flex items-center gap-2">
                <span className="mr-1">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

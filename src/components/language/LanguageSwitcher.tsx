
import React, { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";
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
  const { 
    currentLanguage, 
    setLanguageByCode, 
    languageLoading, 
    supportedLanguages,
    isMobileDevice 
  } = useLanguageMCP();
  const { toast } = useToast();
  const { t, ready } = useTranslation("common");
  const [isChanging, setIsChanging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Get current language metadata
  const currentLangMeta = supportedLanguages.find(l => l.code === currentLanguage) || 
    { code: 'de', name: 'Deutsch', localName: 'Deutsch', flag: '🇩🇪', rtl: false, implemented: true };

  // Debug logging
  useEffect(() => {
    const info = {
      currentLanguage,
      languageLoading,
      isChanging,
      isDropdownOpen,
      isMobileDevice,
      ready,
      supportedLanguagesCount: supportedLanguages.length
    };
    setDebugInfo(info);
    console.log('[LanguageSwitcher] State update:', info);
  }, [currentLanguage, languageLoading, isChanging, isDropdownOpen, isMobileDevice, ready, supportedLanguages]);

  // Simplified mobile handling - remove touch event conflicts
  const handleDropdownOpenChange = (open: boolean) => {
    console.log('[LanguageSwitcher] Dropdown open change:', {
      from: isDropdownOpen,
      to: open,
      isMobile: isMobileDevice
    });
    setIsDropdownOpen(open);
  };

  // Enhanced language change with better mobile support
  const handleLanguageChange = async (langCode: string) => {
    console.log('[LanguageSwitcher] Language change triggered:', {
      from: currentLanguage,
      to: langCode,
      isChanging,
      languageLoading,
      isMobile: isMobileDevice
    });

    if (currentLanguage === langCode || isChanging || languageLoading) {
      console.log('[LanguageSwitcher] Skipping language change - conditions not met');
      return;
    }
    
    try {
      setIsChanging(true);
      setIsDropdownOpen(false); // Close dropdown immediately
      
      // Show immediate feedback
      toast({
        description: "Sprache wird geändert...",
        duration: 1500,
      });
      
      await setLanguageByCode(langCode);
      
      // Success feedback
      const languageName = supportedLanguages.find(l => l.code === langCode)?.name || langCode;
      toast({
        description: t("language_changed", { 
          language: languageName
        }) || `Sprache geändert zu ${languageName}`,
        duration: 2000,
      });
      
    } catch (error) {
      console.error('[LanguageSwitcher] Error changing language:', error);
      toast({
        variant: "destructive",
        description: t("language_change_error") || "Fehler beim Ändern der Sprache",
        duration: 3000,
      });
    } finally {
      // Clear changing state
      setTimeout(() => {
        setIsChanging(false);
        console.log('[LanguageSwitcher] Language change completed');
      }, 300);
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

  const isLoading = languageLoading || isChanging;

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === "compact" ? "ghost" : variant === "outline" ? "outline" : "default"}
          size={variant === "compact" ? "icon" : "sm"}
          className={`${variant === "compact" ? "w-10 h-10 p-0" : "h-10 px-4 gap-2"} ${
            isMobileDevice ? "min-w-[44px] min-h-[44px] touch-manipulation" : ""
          }`}
          disabled={isLoading}
          aria-label={t("change_language") || "Sprache ändern"}
          onClick={() => {
            console.log('[LanguageSwitcher] Button clicked:', {
              isDropdownOpen,
              isLoading,
              isMobile: isMobileDevice
            });
          }}
        >
          {variant === "compact" ? (
            <Globe className="h-5 w-5" />
          ) : (
            <>
              <span className="text-lg">{currentLangMeta.flag}</span>
              {showLabel && <span className="hidden sm:inline">{currentLangMeta.name}</span>}
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin ml-1" />
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`min-w-[200px] max-h-[70vh] overflow-auto bg-background border shadow-lg ${
          isMobileDevice ? "z-[9999]" : "z-50"
        }`}
        sideOffset={isMobileDevice ? 12 : 4}
      >
        <DropdownMenuLabel>
          {t("select_language") || "Sprache wählen"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="max-h-[50vh]">
          {/* Available Languages */}
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                console.log('[LanguageSwitcher] Language item clicked:', lang.code);
                handleLanguageChange(lang.code);
              }}
              className={`cursor-pointer flex items-center justify-between ${
                currentLanguage === lang.code ? "bg-accent" : ""
              } ${isMobileDevice ? "py-4 touch-manipulation min-h-[44px]" : "py-2"}`}
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span className={lang.rtl ? "font-rtl" : ""}>{lang.name}</span>
                {lang.code !== 'de' && lang.code !== 'en' && !isImplementedLanguage(lang.code) && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {t("partial") || "Teilweise"}
                  </span>
                )}
              </div>
              {currentLanguage === lang.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}

          {/* Separator for future languages */}
          {futureLanguages.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("coming_soon") || "Demnächst verfügbar"}
              </DropdownMenuLabel>
            </>
          )}

          {/* Future Languages (Coming Soon) */}
          {futureLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              disabled
              className={`cursor-not-allowed opacity-50 ${
                isMobileDevice ? "py-4" : "py-2"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Debug: {isMobileDevice ? 'Mobile' : 'Desktop'} | Ready: {ready ? 'Yes' : 'No'}
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

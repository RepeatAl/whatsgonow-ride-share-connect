
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

  // Get current language metadata
  const currentLangMeta = supportedLanguages.find(l => l.code === currentLanguage) || 
    { code: 'de', name: 'Deutsch', localName: 'Deutsch', flag: '🇩🇪', rtl: false, implemented: true };

  // Debug logging
  useEffect(() => {
    console.log('[LanguageSwitcher] State update:', {
      currentLanguage,
      languageLoading,
      isChanging,
      isDropdownOpen,
      isMobileDevice,
      ready,
      supportedLanguagesCount: supportedLanguages.length
    });
  }, [currentLanguage, languageLoading, isChanging, isDropdownOpen, isMobileDevice, ready, supportedLanguages]);

  // Handle dropdown open/close
  const handleDropdownOpenChange = (open: boolean) => {
    console.log('[LanguageSwitcher] Dropdown state change:', {
      from: isDropdownOpen,
      to: open,
      isMobile: isMobileDevice
    });
    setIsDropdownOpen(open);
  };

  // Enhanced language change with immediate feedback
  const handleLanguageChange = async (langCode: string) => {
    console.log('[LanguageSwitcher] Language change initiated:', {
      from: currentLanguage,
      to: langCode,
      isChanging,
      languageLoading,
      isMobile: isMobileDevice,
      currentUrl: window.location.href
    });

    // Prevent duplicate calls
    if (currentLanguage === langCode) {
      console.log('[LanguageSwitcher] Already on target language, skipping');
      return;
    }

    if (isChanging || languageLoading) {
      console.log('[LanguageSwitcher] Change already in progress, skipping');
      return;
    }
    
    try {
      setIsChanging(true);
      setIsDropdownOpen(false);
      
      // Show immediate feedback
      const langName = supportedLanguages.find(l => l.code === langCode)?.name || langCode;
      console.log('[LanguageSwitcher] Showing toast for language change to:', langName);
      
      toast({
        description: `Sprache wird zu ${langName} geändert...`,
        duration: 3000,
      });
      
      // Execute language change with small delay for UI feedback
      console.log('[LanguageSwitcher] Calling setLanguageByCode...');
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI feedback
      await setLanguageByCode(langCode);
      
      console.log('[LanguageSwitcher] Language change successful');
      
    } catch (error) {
      console.error('[LanguageSwitcher] Language change failed:', error);
      toast({
        variant: "destructive",
        description: "Fehler beim Ändern der Sprache. Seite wird neu geladen...",
        duration: 3000,
      });
      
      // Fallback: force page reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } finally {
      // Clear changing state
      setTimeout(() => {
        setIsChanging(false);
        console.log('[LanguageSwitcher] Language change state cleared');
      }, 500);
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
        className="h-10 opacity-70"
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
          className={`${variant === "compact" ? "w-12 h-12 p-0" : "h-12 px-4 gap-2"} ${
            isMobileDevice ? "min-w-[48px] min-h-[48px] touch-manipulation" : ""
          } transition-all duration-200 hover:scale-105 active:scale-95 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          aria-label={t("change_language") || "Sprache ändern"}
          onClick={() => {
            console.log('[LanguageSwitcher] Button clicked:', {
              isDropdownOpen,
              isLoading,
              isMobile: isMobileDevice,
              currentLanguage
            });
          }}
        >
          {variant === "compact" ? (
            <>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Globe className="h-6 w-6" />
              )}
            </>
          ) : (
            <>
              <span className="text-xl">{currentLangMeta.flag}</span>
              {showLabel && <span className="hidden sm:inline font-medium">{currentLangMeta.name}</span>}
              {isLoading && (
                <Loader2 className="h-4 w-4 animate-spin ml-1" />
              )}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={`min-w-[220px] max-h-[70vh] overflow-auto bg-background border shadow-xl ${
          isMobileDevice ? "z-[99999]" : "z-50"
        }`}
        sideOffset={isMobileDevice ? 16 : 8}
      >
        <DropdownMenuLabel className="text-base font-semibold">
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
              className={`cursor-pointer flex items-center justify-between transition-colors ${
                currentLanguage === lang.code ? "bg-accent font-medium" : ""
              } ${isMobileDevice ? "py-4 px-4 touch-manipulation min-h-[52px] text-base" : "py-3 px-3"} ${
                isLoading ? "opacity-50 pointer-events-none" : ""
              }`}
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className={`${lang.rtl ? "font-rtl" : ""} font-medium`}>{lang.name}</span>
                {lang.code !== 'de' && lang.code !== 'en' && !isImplementedLanguage(lang.code) && (
                  <span className="text-xs text-muted-foreground ml-1 bg-muted px-2 py-1 rounded">
                    {t("partial") || "Teilweise"}
                  </span>
                )}
              </div>
              {currentLanguage === lang.code && <Check className="h-5 w-5 text-primary" />}
            </DropdownMenuItem>
          ))}

          {/* Separator for future languages */}
          {futureLanguages.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-sm text-muted-foreground">
                {t("coming_soon") || "Demnächst verfügbar"}
              </DropdownMenuLabel>
            </>
          )}

          {futureLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              disabled
              className={`cursor-not-allowed opacity-50 ${
                isMobileDevice ? "py-4 px-4 text-base" : "py-3 px-3"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Debug: {isMobileDevice ? 'Mobile' : 'Desktop'} | Lang: {currentLanguage} | Ready: {ready ? 'Yes' : 'No'}
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
